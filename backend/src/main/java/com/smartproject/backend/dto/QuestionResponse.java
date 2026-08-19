package com.smartproject.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {

    private Long id;

    private String questionText;

    private String topic;

    private String difficulty;

    private String explanation;

    private List<OptionResponse> options;

    // Coding question fields

    private String questionType;

    private String codeTemplate;

    private Integer defaultLanguageId;

    private String allowedLanguages;
}