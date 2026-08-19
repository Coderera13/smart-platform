package com.smartproject.backend.serviceimpl.programming;

import com.smartproject.backend.dto.programming.request.CodeExecutionRequest;
import com.smartproject.backend.dto.programming.request.ProgrammingSubmissionRequest;
import com.smartproject.backend.dto.programming.response.CodeExecutionResponse;
import com.smartproject.backend.dto.programming.response.ProgrammingSubmissionResponse;
import com.smartproject.backend.dto.programming.response.RunCodeResponse;
import com.smartproject.backend.entity.User;
import com.smartproject.backend.entity.programming.ProgrammingQuestion;
import com.smartproject.backend.entity.programming.ProgrammingSubmission;
import com.smartproject.backend.entity.programming.ProgrammingTestCase;
import com.smartproject.backend.exception.ResourceNotFoundException;
import com.smartproject.backend.repository.UserRepository;
import com.smartproject.backend.repository.programming.ProgrammingQuestionRepository;
import com.smartproject.backend.repository.programming.ProgrammingSubmissionRepository;
import com.smartproject.backend.repository.programming.ProgrammingTestCaseRepository;
import com.smartproject.backend.service.programming.Judge0Service;
import com.smartproject.backend.service.programming.ProgrammingSubmissionService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@Transactional
public class ProgrammingSubmissionServiceImpl
        implements ProgrammingSubmissionService {

    private final ProgrammingSubmissionRepository submissionRepository;
    private final ProgrammingQuestionRepository questionRepository;
    private final ProgrammingTestCaseRepository testCaseRepository;
    private final UserRepository userRepository;
    private final Judge0Service judge0Service;

    public ProgrammingSubmissionServiceImpl(
            ProgrammingSubmissionRepository submissionRepository,
            ProgrammingQuestionRepository questionRepository,
            ProgrammingTestCaseRepository testCaseRepository,
            UserRepository userRepository,
            Judge0Service judge0Service) {

        this.submissionRepository = submissionRepository;
        this.questionRepository = questionRepository;
        this.testCaseRepository = testCaseRepository;
        this.userRepository = userRepository;
        this.judge0Service = judge0Service;
    }

    // ============================================================
    // RUN CODE
    // ============================================================

    @Override
    public RunCodeResponse runCode(
            ProgrammingSubmissionRequest request) {

        ProgrammingQuestion question =
                getQuestion(request.getProgrammingQuestionId());

        int languageId = getLanguageId(request.getLanguage());

        List<ProgrammingTestCase> testCases =
                testCaseRepository.findByProgrammingQuestionId(question.getId());

        /*
         * RUN is for testing code before final submission.
         *
         * We use the first PUBLIC test case.
         * Hidden test cases are never exposed through RUN.
         */

        ProgrammingTestCase testCase = testCases.stream()
                .filter(tc -> !Boolean.TRUE.equals(tc.getHidden()))
                .findFirst()
                .orElse(null);

        String input;

        if (request.getStdin() != null && !request.getStdin().isBlank()) {
                input = request.getStdin();
        } else {
                input = testCase != null
                        ? testCase.getInput()
                        : "";
        }

        CodeExecutionRequest executionRequest =
                new CodeExecutionRequest();

        executionRequest.setSourceCode(request.getSourceCode());
        executionRequest.setLanguageId(languageId);
        executionRequest.setStdin(input);

        CodeExecutionResponse result =
                judge0Service.execute(executionRequest);

        String status = result.getStatus();

        String output = result.getStdout();
        String error = getError(result);

        return RunCodeResponse.builder()
                .status(status)
                .output(output)
                .error(error)
                .executionTime(toMilliseconds(result.getTime()))
                .memoryUsed(toInteger(result.getMemory()))
                .build();
    }

    // ============================================================
    // SUBMIT CODE
    // ============================================================

    @Override
    public ProgrammingSubmissionResponse submitCode(
            ProgrammingSubmissionRequest request) {

        User user = getCurrentUser();

        ProgrammingQuestion question =
                getQuestion(request.getProgrammingQuestionId());

        int languageId = getLanguageId(request.getLanguage());

        List<ProgrammingTestCase> testCases =
                testCaseRepository.findByProgrammingQuestionId(question.getId());

        if (testCases.isEmpty()) {
            throw new IllegalStateException(
                    "No test cases configured for programming question: "
                            + question.getId()
            );
        }

        int passedTests = 0;

        double totalExecutionTime = 0.0;
        int maxMemoryUsed = 0;

        String finalStatus = "Accepted";

        for (ProgrammingTestCase testCase : testCases) {

            CodeExecutionRequest executionRequest =
                    new CodeExecutionRequest();

            executionRequest.setSourceCode(request.getSourceCode());
            executionRequest.setLanguageId(languageId);
            executionRequest.setStdin(testCase.getInput());

            CodeExecutionResponse result =
                    judge0Service.execute(executionRequest);

            totalExecutionTime +=
                    toMilliseconds(result.getTime());

            int memory = toInteger(result.getMemory());

            if (memory > maxMemoryUsed) {
                maxMemoryUsed = memory;
            }

            /*
             * Judge0 status IDs:
             *
             * 3 = Accepted
             * 4 = Wrong Answer
             * 5 = Time Limit Exceeded
             * 6 = Compilation Error
             * 7+ = Runtime / system errors
             */

            Integer statusId = result.getStatusId();

            if (statusId == null) {
                finalStatus = "Execution Error";
                break;
            }

            if (statusId == 3) {

                String actualOutput =
                        normalizeOutput(result.getStdout());

                String expectedOutput =
                        normalizeOutput(testCase.getExpectedOutput());

                if (actualOutput.equals(expectedOutput)) {
                    passedTests++;
                } else {
                    finalStatus = "Wrong Answer";
                    break;
                }

            } else {

                finalStatus = mapJudge0Status(
                        statusId,
                        result.getStatus()
                );

                break;
            }
        }

        /*
         * Score:
         *
         * Example:
         * 8 / 10 tests passed
         * question marks = 100
         *
         * score = 80
         */

        int totalTests = testCases.size();

        int score = 0;

        if (totalTests > 0) {
            score = (int) Math.round(
                    ((double) passedTests / totalTests)
                            * question.getMarks()
            );
        }

        /*
         * Only completely passing submissions are Accepted.
         */

        if (passedTests == totalTests) {
            finalStatus = "Accepted";
        }

        ProgrammingSubmission submission =
                ProgrammingSubmission.builder()
                        .user(user)
                        .programmingQuestion(question)
                        .language(request.getLanguage())
                        .sourceCode(request.getSourceCode())
                        .status(finalStatus)
                        .score(score)
                        .executionTime(totalExecutionTime)
                        .memoryUsed(maxMemoryUsed)
                        .submittedAt(LocalDateTime.now())
                        .build();

        ProgrammingSubmission saved =
                submissionRepository.save(submission);

        return mapToResponse(saved);
    }

    // ============================================================
    // GET MY SUBMISSIONS
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public List<ProgrammingSubmissionResponse> getMySubmissions() {

        User user = getCurrentUser();

        return submissionRepository
                .findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ============================================================
    // GET SINGLE SUBMISSION
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public ProgrammingSubmissionResponse getSubmissionById(Long id) {

        User user = getCurrentUser();

        ProgrammingSubmission submission =
                submissionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Submission not found with id: " + id
                                )
                        );

        /*
         * A student can only see their own submission.
         */

        if (!submission.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(
                    "You are not allowed to access this submission"
            );
        }

        return mapToResponse(submission);
    }

    // ============================================================
    // CURRENT USER
    // ============================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new IllegalStateException(
                    "User is not authenticated"
            );
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        )
                );
    }

    // ============================================================
    // QUESTION
    // ============================================================

    private ProgrammingQuestion getQuestion(Long id) {

        if (id == null) {
            throw new IllegalArgumentException(
                    "Programming question ID is required"
            );
        }

        return questionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Programming question not found with id: "
                                        + id
                        )
                );
    }

    // ============================================================
    // LANGUAGE CONVERSION
    // ============================================================

    private int getLanguageId(String language) {

        if (language == null || language.isBlank()) {
            throw new IllegalArgumentException(
                    "Programming language is required"
            );
        }

        String normalized =
                language.trim()
                        .toUpperCase(Locale.ROOT);

        return switch (normalized) {

            case "JAVA" -> 62;

            case "PYTHON",
                 "PYTHON3" -> 71;

            case "JAVASCRIPT",
                 "JS" -> 63;

            case "C" -> 50;

            case "C++",
                 "CPP" -> 54;

            default -> throw new IllegalArgumentException(
                    "Unsupported programming language: "
                            + language
            );
        };
    }

    // ============================================================
    // OUTPUT NORMALIZATION
    // ============================================================

    private String normalizeOutput(String output) {

        if (output == null) {
            return "";
        }

        return output
                .replace("\r\n", "\n")
                .replace("\r", "\n")
                .trim();
    }

    // ============================================================
    // JUDGE0 STATUS
    // ============================================================

    private String mapJudge0Status(
            Integer statusId,
            String statusDescription) {

        return switch (statusId) {

            case 1 -> "In Queue";

            case 2 -> "Processing";

            case 3 -> "Accepted";

            case 4 -> "Wrong Answer";

            case 5 -> "Time Limit Exceeded";

            case 6 -> "Compilation Error";

            case 7 -> "Runtime Error";

            case 8 -> "Runtime Error";

            case 9 -> "Runtime Error";

            case 10 -> "Runtime Error";

            case 11 -> "Runtime Error";

            case 12 -> "Runtime Error";

            case 13 -> "Internal Error";

            case 14 -> "Exec Format Error";

            default -> statusDescription != null
                    ? statusDescription
                    : "Execution Error";
        };
    }

    // ============================================================
    // ERROR
    // ============================================================

    private String getError(CodeExecutionResponse result) {

        if (result.getCompileOutput() != null &&
                !result.getCompileOutput().isBlank()) {

            return result.getCompileOutput();
        }

        if (result.getStderr() != null &&
                !result.getStderr().isBlank()) {

            return result.getStderr();
        }

        if (result.getMessage() != null &&
                !result.getMessage().isBlank()) {

            return result.getMessage();
        }

        return null;
    }

    // ============================================================
    // TIME
    // ============================================================

    private Double toMilliseconds(String time) {

        if (time == null || time.isBlank()) {
            return 0.0;
        }

        try {
            /*
             * Judge0 returns execution time in seconds.
             * Our entity stores milliseconds.
             */

            return Double.parseDouble(time) * 1000.0;

        } catch (NumberFormatException ex) {
            return 0.0;
        }
    }

    // ============================================================
    // MEMORY
    // ============================================================

    private Integer toInteger(Long value) {

        if (value == null) {
            return 0;
        }

        return value.intValue();
    }

    // ============================================================
    // RESPONSE MAPPING
    // ============================================================

    private ProgrammingSubmissionResponse mapToResponse(
            ProgrammingSubmission submission) {

        return ProgrammingSubmissionResponse.builder()
                .id(submission.getId())
                .programmingQuestionId(
                        submission.getProgrammingQuestion().getId()
                )
                .language(submission.getLanguage())
                .status(submission.getStatus())
                .score(submission.getScore())
                .executionTime(submission.getExecutionTime())
                .memoryUsed(submission.getMemoryUsed())
                .submittedAt(submission.getSubmittedAt())
                .build();
    }
}
