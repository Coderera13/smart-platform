package com.smartproject.backend.controller;

import com.smartproject.backend.dto.StartTestResponse;
import com.smartproject.backend.dto.FinishAttemptResponse;
import com.smartproject.backend.dto.AttemptHistoryResponse;
import com.smartproject.backend.dto.AttemptResultResponse;
import com.smartproject.backend.dto.AttemptReviewResponse;
import com.smartproject.backend.service.TestAttemptService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attempts")
@CrossOrigin(origins = "http://localhost:3000")
public class TestAttemptController {

    private final TestAttemptService testAttemptService;

    public TestAttemptController(TestAttemptService testAttemptService) {
        this.testAttemptService = testAttemptService;
    }

    @PostMapping("/start/{testId}")
    public ResponseEntity<StartTestResponse> startTest(@PathVariable Long testId,
                                                       Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(testAttemptService.startTest(testId, email));
    }

    @PostMapping("/finish/{attemptId}")
    public ResponseEntity<FinishAttemptResponse> finishAttempt(
            @PathVariable Long attemptId,
            Authentication authentication
    ) {
    
        String email = authentication.getName();
    
        return ResponseEntity.ok(
                testAttemptService.finishAttempt(attemptId, email)
        );
    }

    @GetMapping("/{attemptId}/result")
    public ResponseEntity<AttemptResultResponse> getAttemptResult(
            @PathVariable Long attemptId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(testAttemptService.getAttemptResult(attemptId, email));
    }
    
    @GetMapping("/my-history")
    public ResponseEntity<List<AttemptHistoryResponse>> getMyAttemptHistory(
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(testAttemptService.getMyAttemptHistory(email));
    }

    @GetMapping("/{attemptId}/review")
    public ResponseEntity<List<AttemptReviewResponse>> getAttemptReview(
            @PathVariable Long attemptId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(testAttemptService.getAttemptReview(attemptId, email));
    }
}