package com.smartproject.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class QuestionRequest {

    @NotBlank
    private String questionText;

    @NotBlank
    private String topic;

    @NotBlank
    private String difficulty;

    private String explanation;

    @NotEmpty
    private List<OptionRequest> options;
}