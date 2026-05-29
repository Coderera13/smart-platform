package com.smartproject.backend.dto;

import lombok.Data;

@Data
public class OptionRequest {
    private String optionText;
    private boolean correct;
}