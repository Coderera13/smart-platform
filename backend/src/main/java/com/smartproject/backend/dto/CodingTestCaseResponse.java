package com.smartproject.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodingTestCaseResponse {

    private Long id;

    private Long questionId;

    private String input;

    private String expectedOutput;

    private Boolean hidden;
}