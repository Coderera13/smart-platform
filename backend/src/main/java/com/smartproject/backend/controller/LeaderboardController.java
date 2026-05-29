package com.smartproject.backend.controller;

import com.smartproject.backend.dto.LeaderboardResponse;
import com.smartproject.backend.service.TestAttemptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "http://localhost:3000")
public class LeaderboardController {

    private final TestAttemptService testAttemptService;

    public LeaderboardController(TestAttemptService testAttemptService) {
        this.testAttemptService = testAttemptService;
    }

    @GetMapping("/{testId}/leaderboard")
    public ResponseEntity<List<LeaderboardResponse>> getLeaderboard(@PathVariable Long testId) {
        return ResponseEntity.ok(testAttemptService.getLeaderboard(testId));
    }
}