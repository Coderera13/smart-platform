package com.smartproject.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartproject.backend.dto.CodingTestCaseRequest;
import com.smartproject.backend.dto.CodingTestCaseResponse;
import com.smartproject.backend.entity.CodingTestCase;
import com.smartproject.backend.entity.Question;
import com.smartproject.backend.repository.CodingTestCaseRepository;
import com.smartproject.backend.repository.QuestionRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class CodingTestCaseController {

    private final CodingTestCaseRepository codingTestCaseRepository;
    private final QuestionRepository questionRepository;

    @PostMapping("/{questionId}/test-cases")
    public ResponseEntity<CodingTestCaseResponse> createTestCase(
            @PathVariable Long questionId,
            @RequestBody CodingTestCaseRequest request) {

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() ->
                        new RuntimeException("Question not found with id: " + questionId));

        CodingTestCase testCase = CodingTestCase.builder()
                .question(question)
                .input(request.getInput())
                .expectedOutput(request.getExpectedOutput())
                .hidden(request.getHidden() != null && request.getHidden())
                .build();

        CodingTestCase saved = codingTestCaseRepository.save(testCase);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(saved));
    }

    @GetMapping("/{questionId}/test-cases")
    public ResponseEntity<List<CodingTestCaseResponse>> getTestCases(
            @PathVariable Long questionId) {

        if (!questionRepository.existsById(questionId)) {
            throw new RuntimeException(
                    "Question not found with id: " + questionId);
        }

        List<CodingTestCaseResponse> response =
                codingTestCaseRepository
                        .findByQuestionId(questionId)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/test-cases/{testCaseId}")
    public ResponseEntity<Void> deleteTestCase(
            @PathVariable Long testCaseId) {

        if (!codingTestCaseRepository.existsById(testCaseId)) {
            return ResponseEntity.notFound().build();
        }

        codingTestCaseRepository.deleteById(testCaseId);

        return ResponseEntity.noContent().build();
    }

    private CodingTestCaseResponse toResponse(CodingTestCase testCase) {

        return CodingTestCaseResponse.builder()
                .id(testCase.getId())
                .questionId(testCase.getQuestion().getId())
                .input(testCase.getInput())
                .expectedOutput(testCase.getExpectedOutput())
                .hidden(testCase.getHidden())
                .build();
    }
}