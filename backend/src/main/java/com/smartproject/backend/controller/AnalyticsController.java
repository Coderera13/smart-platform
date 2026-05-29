package com.smartproject.backend.controller;

import com.smartproject.backend.dto.TestAnalyticsResponse;
import com.smartproject.backend.service.TestAttemptService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final TestAttemptService testAttemptService;

    public AnalyticsController(TestAttemptService testAttemptService) {
        this.testAttemptService = testAttemptService;
    }

    @GetMapping("/tests/{testId}/analytics")
    public ResponseEntity<TestAnalyticsResponse> getTestAnalytics(@PathVariable Long testId) {
        return ResponseEntity.ok(testAttemptService.getTestAnalytics(testId));
    }
}