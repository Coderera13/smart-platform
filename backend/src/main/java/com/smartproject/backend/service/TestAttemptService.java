package com.smartproject.backend.service;

import com.smartproject.backend.dto.AttemptHistoryResponse;
import com.smartproject.backend.dto.AttemptResultResponse;
import com.smartproject.backend.dto.AttemptReviewResponse;
import com.smartproject.backend.dto.FinishAttemptResponse;
import com.smartproject.backend.dto.LeaderboardResponse;
import com.smartproject.backend.dto.StartTestResponse;
import com.smartproject.backend.dto.TestAnalyticsResponse;

import java.util.List;

public interface TestAttemptService {
    StartTestResponse startTest(Long testId, String email);
    FinishAttemptResponse finishAttempt(Long attemptId, String email);
    AttemptResultResponse getAttemptResult(Long attemptId, String email);
    List<AttemptHistoryResponse> getMyAttemptHistory(String email);
    List<AttemptReviewResponse> getAttemptReview(Long attemptId, String email);
    List<LeaderboardResponse> getLeaderboard(Long testId);
    TestAnalyticsResponse getTestAnalytics(Long testId);
}