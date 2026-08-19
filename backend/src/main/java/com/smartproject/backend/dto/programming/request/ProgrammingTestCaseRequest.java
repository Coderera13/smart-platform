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
public class ProgrammingTestCaseRequest {

    private Long programmingQuestionId;
    private String input;
    private String expectedOutput;
    private Boolean hidden;
}