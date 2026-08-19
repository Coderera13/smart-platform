package com.smartproject.backend.controller.programming;

import com.smartproject.backend.dto.programming.request.ProgrammingTestCaseRequest;
import com.smartproject.backend.dto.programming.response.ProgrammingTestCaseResponse;
import com.smartproject.backend.service.programming.ProgrammingTestCaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/programming/test-cases")
@RequiredArgsConstructor
public class ProgrammingTestCaseController {

    private final ProgrammingTestCaseService programmingTestCaseService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProgrammingTestCaseResponse> createTestCase(
            @Valid @RequestBody ProgrammingTestCaseRequest request) {

        ProgrammingTestCaseResponse response =
                programmingTestCaseService.createTestCase(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/question/{questionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProgrammingTestCaseResponse>> getTestCases(
            @PathVariable Long questionId) {

        List<ProgrammingTestCaseResponse> response =
                programmingTestCaseService
                        .getTestCasesByQuestionId(questionId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProgrammingTestCaseResponse> getTestCase(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                programmingTestCaseService.getTestCaseById(id)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProgrammingTestCaseResponse> updateTestCase(
            @PathVariable Long id,
            @Valid @RequestBody ProgrammingTestCaseRequest request) {

        return ResponseEntity.ok(
                programmingTestCaseService.updateTestCase(id, request)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTestCase(
            @PathVariable Long id) {

        programmingTestCaseService.deleteTestCase(id);

        return ResponseEntity.noContent().build();
    }
}