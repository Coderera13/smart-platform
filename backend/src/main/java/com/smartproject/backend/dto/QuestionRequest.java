package com.smartproject.backend.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestionRequest {

    @NotBlank
    private String questionText;

    @NotBlank
    private String topic;

    @NotBlank
    private String difficulty;

    private String explanation;

    /*
     * Required only for MCQ questions.
     * Coding questions do not need options.
     */
    private List<OptionRequest> options;

    // Coding question support

    private String questionType;

    private String codeTemplate;

    private Integer defaultLanguageId;

    private String allowedLanguages;
}