package com.smartproject.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class FinishAttemptResponse {

    private Long attemptId;

    private boolean completed;

    private Integer score;

    private LocalDateTime submittedAt;
}