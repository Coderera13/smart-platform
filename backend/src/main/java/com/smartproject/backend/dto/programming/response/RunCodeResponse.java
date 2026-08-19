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
public class RunCodeResponse {

    private String status;
    private String output;
    private String error;
    private Double executionTime;
    private Integer memoryUsed;
}