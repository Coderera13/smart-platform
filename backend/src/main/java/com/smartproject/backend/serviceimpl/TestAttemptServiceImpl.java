package com.smartproject.backend.serviceimpl;

import com.smartproject.backend.dto.QuestionResponse;
import com.smartproject.backend.dto.StartTestResponse;
import com.smartproject.backend.dto.FinishAttemptResponse;
import com.smartproject.backend.dto.AttemptHistoryResponse;
import com.smartproject.backend.dto.AttemptResultResponse;
import com.smartproject.backend.dto.AttemptReviewResponse;
import com.smartproject.backend.dto.LeaderboardResponse;
import com.smartproject.backend.dto.TestAnalyticsResponse;
import com.smartproject.backend.entity.Test;
import com.smartproject.backend.entity.StudentAnswer;
import com.smartproject.backend.entity.TestAttempt;
import com.smartproject.backend.entity.User;
import com.smartproject.backend.entity.Question;
import com.smartproject.backend.exception.ResourceNotFoundException;
import com.smartproject.backend.repository.TestRepository;
import com.smartproject.backend.repository.StudentAnswerRepository;
import com.smartproject.backend.repository.TestAttemptRepository;
import com.smartproject.backend.repository.UserRepository;
import com.smartproject.backend.service.TestAttemptService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class TestAttemptServiceImpl implements TestAttemptService {

    private final TestAttemptRepository testAttemptRepository;
    private final TestRepository testRepository;
    private final UserRepository userRepository;
    private final StudentAnswerRepository studentAnswerRepository;

    public TestAttemptServiceImpl(TestAttemptRepository testAttemptRepository,
                              TestRepository testRepository,
                              UserRepository userRepository,
                              StudentAnswerRepository studentAnswerRepository) {
        this.testAttemptRepository = testAttemptRepository;
        this.testRepository = testRepository;
        this.userRepository = userRepository;
        this.studentAnswerRepository = studentAnswerRepository;
   }

    @Override
    public StartTestResponse startTest(Long testId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found with id: " + testId));

        TestAttempt attempt = TestAttempt.builder()
                .user(user)
                .test(test)
                .startedAt(LocalDateTime.now())
                .completed(false)
                .score(0)
                .build();

        TestAttempt savedAttempt = testAttemptRepository.save(attempt);

        List<QuestionResponse> questions = test.getQuestions()
                .stream()
                .map(question -> QuestionResponse.builder()
                        .id(question.getId())
                        .questionText(question.getQuestionText())
                        .difficulty(question.getDifficulty())
                        .topic(question.getTopic())
                        .explanation(question.getExplanation())
                        .options(question.getOptions().stream()
                                .map(option -> com.smartproject.backend.dto.OptionResponse.builder()
                                        .id(option.getId())
                                        .optionText(option.getOptionText())
                                        .correct(option.isCorrect())
                                        .build())
                                .toList())
                        .build())
                .toList();

        return StartTestResponse.builder()
                .attemptId(savedAttempt.getId())
                .testId(test.getId())
                .title(test.getTitle())
                .description(test.getDescription())
                .durationMinutes(test.getDurationMinutes())
                .startedAt(savedAttempt.getStartedAt())
                .questions(questions)
                .build();
    }

    @Transactional
    @Override
    public FinishAttemptResponse finishAttempt(Long attemptId, String email) {
    
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with email: " + email));
    
        TestAttempt attempt = testAttemptRepository.findById(attemptId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Attempt not found with id: " + attemptId));
    
        if (!attempt.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized attempt access");
        }
    
        List<StudentAnswer> answers = studentAnswerRepository.findByTestAttemptId(attemptId);
    
        int score = 0;
        for (StudentAnswer answer : answers) {
            if (answer.getSelectedOption() != null && answer.getSelectedOption().isCorrect()) {
                score++;
            }
        }
    
        attempt.setScore(score);
        attempt.setCompleted(true);
        attempt.setSubmittedAt(LocalDateTime.now());
    
        TestAttempt savedAttempt = testAttemptRepository.save(attempt);
    
        return FinishAttemptResponse.builder()
                .attemptId(savedAttempt.getId())
                .completed(savedAttempt.isCompleted())
                .score(savedAttempt.getScore())
                .submittedAt(savedAttempt.getSubmittedAt())
                .build();
    }

    @Override
    public AttemptResultResponse getAttemptResult(Long attemptId, String email) {
    
        TestAttempt attempt = testAttemptRepository.findByIdAndUser_Email(attemptId, email)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with id: " + attemptId));
    
        return AttemptResultResponse.builder()
                .attemptId(attempt.getId())
                .testId(attempt.getTest().getId())
                .testTitle(attempt.getTest().getTitle())
                .score(attempt.getScore())
                .completed(attempt.isCompleted())
                .startedAt(attempt.getStartedAt())
                .submittedAt(attempt.getSubmittedAt())
                .totalQuestions(attempt.getTest().getQuestions().size())
                .build();
    }

    @Override
    public List<AttemptHistoryResponse> getMyAttemptHistory(String email) {
    
        List<TestAttempt> attempts = testAttemptRepository.findByUser_EmailOrderByStartedAtDesc(email);
    
        return attempts.stream()
                .map(attempt -> AttemptHistoryResponse.builder()
                        .attemptId(attempt.getId())
                        .testId(attempt.getTest().getId())
                        .testTitle(attempt.getTest().getTitle())
                        .score(attempt.getScore())
                        .completed(attempt.isCompleted())
                        .startedAt(attempt.getStartedAt())
                        .submittedAt(attempt.getSubmittedAt())
                        .build())
                .toList();
    }

    @Override
    public List<AttemptReviewResponse> getAttemptReview(Long attemptId, String email) {
    
        TestAttempt attempt = testAttemptRepository.findByIdAndUser_Email(attemptId, email)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with id: " + attemptId));
    
        List<StudentAnswer> answers = studentAnswerRepository.findByTestAttemptId(attemptId);
    
        return answers.stream()
                .map(answer -> {
                    Question question = answer.getQuestion();
    
                    String selectedOptionText = null;
                    if (answer.getSelectedOption() != null) {
                        selectedOptionText = answer.getSelectedOption().getOptionText();
                    }
    
                    String correctOptionText = question.getOptions().stream()
                            .filter(option -> option.isCorrect())
                            .map(option -> option.getOptionText())
                            .findFirst()
                            .orElse(null);
    
                    boolean isCorrect = answer.getSelectedOption() != null
                            && answer.getSelectedOption().isCorrect();
    
                    AttemptReviewResponse response = AttemptReviewResponse.builder()
                            .questionId(question.getId())
                            .questionText(question.getQuestionText())
                            .selectedOptionText(selectedOptionText)
                            .correctOptionText(correctOptionText)
                            .correct(isCorrect)
                            .build();
    
                    return response;
                })
                .toList();
    }

    @Override
    public List<LeaderboardResponse> getLeaderboard(Long testId) {
    
        List<TestAttempt> attempts =
                testAttemptRepository.findCompletedAttemptsForLeaderboard(testId);
    
        AtomicInteger rank = new AtomicInteger(1);
    
        return attempts.stream()
                .map(attempt -> LeaderboardResponse.builder()
                        .rank(rank.getAndIncrement())
                        .attemptId(attempt.getId())
                        .studentName(attempt.getUser().getName())
                        .score(attempt.getScore())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    @Override
    public TestAnalyticsResponse getTestAnalytics(Long testId) {
    
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found with id: " + testId));
    
        Long totalAttempts = testAttemptRepository.countAttemptsByTestId(testId);
        Long completedAttempts = testAttemptRepository.countCompletedAttemptsByTestId(testId);
        Double averageScore = testAttemptRepository.findAverageScoreByTestId(testId);
        Integer highestScore = testAttemptRepository.findHighestScoreByTestId(testId);
        Integer lowestScore = testAttemptRepository.findLowestScoreByTestId(testId);
    
        return TestAnalyticsResponse.builder()
                .testId(test.getId())
                .testTitle(test.getTitle())
                .totalAttempts(totalAttempts)
                .completedAttempts(completedAttempts)
                .averageScore(averageScore)
                .highestScore(highestScore)
                .lowestScore(lowestScore)
                .build();
    }
}