package com.smartproject.backend.dto.programming.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammingSubmissionResponse {

    private Long id;
    private Long programmingQuestionId;
    private String language;
    private String status;
    private Integer score;
    private Double executionTime;
    private Integer memoryUsed;
    private LocalDateTime submittedAt;
}