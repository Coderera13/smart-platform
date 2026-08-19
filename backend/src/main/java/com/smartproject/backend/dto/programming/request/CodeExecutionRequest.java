package com.smartproject.backend.dto.programming.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CodeExecutionRequest {

    @NotBlank
    private String sourceCode;

    @NotNull
    private Integer languageId;

    private String stdin;

    public CodeExecutionRequest() {
    }

    public String getSourceCode() {
        return sourceCode;
    }

    public void setSourceCode(String sourceCode) {
        this.sourceCode = sourceCode;
    }

    public Integer getLanguageId() {
        return languageId;
    }

    public void setLanguageId(Integer languageId) {
        this.languageId = languageId;
    }

    public String getStdin() {
        return stdin;
    }

    public void setStdin(String stdin) {
        this.stdin = stdin;
    }
}