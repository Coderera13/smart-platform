package com.smartproject.backend.dto.programming.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammingQuestionRequest {

    private String title;
    private String description;
    private String topic;
    private String difficulty;
    private Integer marks;
    private Integer timeLimit;
    private Integer memoryLimit;
    private String starterCode;
    private String constraints;
}