package com.smartproject.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodingTestCaseRequest {

    private String input;

    private String expectedOutput;

    private Boolean hidden;
}