package com.smartproject.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestAnalyticsResponse {

    private Long testId;
    private String testTitle;
    private Long totalAttempts;
    private Long completedAttempts;
    private Double averageScore;
    private Integer highestScore;
    private Integer lowestScore;
}