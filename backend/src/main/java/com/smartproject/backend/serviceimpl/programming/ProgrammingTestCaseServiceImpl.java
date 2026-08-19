package com.smartproject.backend.serviceImpl.programming;

import com.smartproject.backend.dto.programming.request.ProgrammingTestCaseRequest;
import com.smartproject.backend.dto.programming.response.ProgrammingTestCaseResponse;
import com.smartproject.backend.entity.programming.ProgrammingQuestion;
import com.smartproject.backend.entity.programming.ProgrammingTestCase;
import com.smartproject.backend.repository.programming.ProgrammingQuestionRepository;
import com.smartproject.backend.repository.programming.ProgrammingTestCaseRepository;
import com.smartproject.backend.service.programming.ProgrammingTestCaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgrammingTestCaseServiceImpl
        implements ProgrammingTestCaseService {

    private final ProgrammingTestCaseRepository programmingTestCaseRepository;

    private final ProgrammingQuestionRepository programmingQuestionRepository;

    @Override
    public ProgrammingTestCaseResponse createTestCase(
            ProgrammingTestCaseRequest request) {

        ProgrammingQuestion question =
                programmingQuestionRepository.findById(
                        request.getProgrammingQuestionId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Programming question not found with id: "
                                        + request.getProgrammingQuestionId()
                        )
                );

        ProgrammingTestCase testCase = ProgrammingTestCase.builder()
                .input(request.getInput())
                .expectedOutput(request.getExpectedOutput())
                .hidden(request.getHidden() != null
                        ? request.getHidden()
                        : false)
                .programmingQuestion(question)
                .build();

        ProgrammingTestCase savedTestCase =
                programmingTestCaseRepository.save(testCase);

        return mapToResponse(savedTestCase);
    }

    @Override
    public List<ProgrammingTestCaseResponse> getTestCasesByQuestionId(
            Long programmingQuestionId) {

        return programmingTestCaseRepository
                .findByProgrammingQuestionId(programmingQuestionId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProgrammingTestCaseResponse getTestCaseById(Long id) {

        ProgrammingTestCase testCase =
                programmingTestCaseRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Programming test case not found with id: "
                                                + id
                                )
                        );

        return mapToResponse(testCase);
    }

    @Override
    public ProgrammingTestCaseResponse updateTestCase(
            Long id,
            ProgrammingTestCaseRequest request) {

        ProgrammingTestCase testCase =
                programmingTestCaseRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Programming test case not found with id: "
                                                + id
                                )
                        );

        ProgrammingQuestion question =
                programmingQuestionRepository.findById(
                        request.getProgrammingQuestionId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Programming question not found with id: "
                                        + request.getProgrammingQuestionId()
                        )
                );

        testCase.setInput(request.getInput());
        testCase.setExpectedOutput(request.getExpectedOutput());
        testCase.setHidden(
                request.getHidden() != null
                        ? request.getHidden()
                        : false
        );
        testCase.setProgrammingQuestion(question);

        ProgrammingTestCase updatedTestCase =
                programmingTestCaseRepository.save(testCase);

        return mapToResponse(updatedTestCase);
    }

    @Override
    public void deleteTestCase(Long id) {

        if (!programmingTestCaseRepository.existsById(id)) {
            throw new RuntimeException(
                    "Programming test case not found with id: " + id
            );
        }

        programmingTestCaseRepository.deleteById(id);
    }

    private ProgrammingTestCaseResponse mapToResponse(
            ProgrammingTestCase testCase) {

        return ProgrammingTestCaseResponse.builder()
                .id(testCase.getId())
                .programmingQuestionId(
                        testCase.getProgrammingQuestion().getId()
                )
                .input(testCase.getInput())
                .expectedOutput(testCase.getExpectedOutput())
                .hidden(testCase.getHidden())
                .build();
    }
}