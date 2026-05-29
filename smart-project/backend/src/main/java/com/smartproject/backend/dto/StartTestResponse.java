package com.smartproject.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StartTestResponse {

    private Long attemptId;
    private Long testId;
    private String title;
    private String description;
    private Integer durationMinutes;
    private LocalDateTime startedAt;
    private List<QuestionResponse> questions;
}