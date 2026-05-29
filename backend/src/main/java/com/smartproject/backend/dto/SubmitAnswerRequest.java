package com.smartproject.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitAnswerRequest {

    @NotNull(message = "Attempt ID is required")
    private Long attemptId;

    @NotNull(message = "Question ID is required")
    private Long questionId;

    @NotNull(message = "Selected option ID is required")
    private Long selectedOptionId;
}