package com.smartproject.backend.dto.programming.response;

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
public class ProgrammingTestCaseResponse {

    private Long id;
    private Long programmingQuestionId;
    private String input;
    private String expectedOutput;
    private Boolean hidden;
}