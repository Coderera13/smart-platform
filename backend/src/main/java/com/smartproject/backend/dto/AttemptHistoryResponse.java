package com.smartproject.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttemptHistoryResponse {

    private Long attemptId;
    private Long testId;
    private String testTitle;
    private Integer score;
    private boolean completed;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
}