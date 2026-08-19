package com.smartproject.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "judge0")
public class Judge0Config {

    private String baseUrl;

    private String apiKey;

    private Boolean useApiKey = false;
}