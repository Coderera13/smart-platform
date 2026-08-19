package com.smartproject.backend.controller.programming;

import com.smartproject.backend.dto.programming.request.ProgrammingSubmissionRequest;
import com.smartproject.backend.dto.programming.response.ProgrammingSubmissionResponse;
import com.smartproject.backend.dto.programming.response.RunCodeResponse;
import com.smartproject.backend.service.programming.ProgrammingSubmissionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programming/submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class ProgrammingSubmissionController {

    private final ProgrammingSubmissionService submissionService;

    // ============================================================
    // RUN CODE
    // ============================================================

    @PostMapping("/run")
    public ResponseEntity<RunCodeResponse> runCode(
            @Valid @RequestBody ProgrammingSubmissionRequest request) {

        return ResponseEntity.ok(
                submissionService.runCode(request)
        );
    }

    // ============================================================
    // SUBMIT CODE
    // ============================================================

    @PostMapping("/submit")
    public ResponseEntity<ProgrammingSubmissionResponse> submitCode(
            @Valid @RequestBody ProgrammingSubmissionRequest request) {

        return ResponseEntity.ok(
                submissionService.submitCode(request)
        );
    }

    // ============================================================
    // MY SUBMISSIONS
    // ============================================================

    @GetMapping("/my")
    public ResponseEntity<List<ProgrammingSubmissionResponse>> getMySubmissions() {

        return ResponseEntity.ok(
                submissionService.getMySubmissions()
        );
    }

    // ============================================================
    // SINGLE SUBMISSION
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<ProgrammingSubmissionResponse> getSubmissionById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                submissionService.getSubmissionById(id)
        );
    }
}
