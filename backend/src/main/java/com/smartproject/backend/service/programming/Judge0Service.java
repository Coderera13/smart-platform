package com.smartproject.backend.service.programming;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartproject.backend.dto.programming.request.CodeExecutionRequest;
import com.smartproject.backend.dto.programming.response.CodeExecutionResponse;

@Service
public class Judge0Service {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public Judge0Service(
            @Value("${judge0.base-url}") String baseUrl,
            ObjectMapper objectMapper
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();

        this.objectMapper = objectMapper;
    }

    public CodeExecutionResponse execute(CodeExecutionRequest request) {

        validateLanguage(request.getLanguageId());

        Map<String, Object> judge0Request = new HashMap<>();

        judge0Request.put("source_code", request.getSourceCode());
        judge0Request.put("language_id", request.getLanguageId());

        if (request.getStdin() != null) {
            judge0Request.put("stdin", request.getStdin());
        }

        // Resource limits
        judge0Request.put("cpu_time_limit", 5);
        judge0Request.put("memory_limit", 128000);

        JsonNode result = restClient.post()
                .uri("/submissions?base64_encoded=false&wait=true")
                .contentType(MediaType.APPLICATION_JSON)
                .body(judge0Request)
                .retrieve()
                .body(JsonNode.class);

        return convertResponse(result);
    }

    private void validateLanguage(Integer languageId) {

        if (languageId == null) {
            throw new IllegalArgumentException("Language ID is required");
        }

        /*
         * Languages currently verified on your Judge0 installation:
         *
         * 50 = C GCC 9.2
         * 54 = C++ GCC 9.2
         * 62 = Java OpenJDK 13
         * 63 = JavaScript Node.js 12
         * 71 = Python 3.8
         */

        if (!SetOfLanguages.SUPPORTED.contains(languageId)) {
            throw new IllegalArgumentException(
                    "Unsupported language ID: " + languageId
            );
        }
    }

    private CodeExecutionResponse convertResponse(JsonNode result) {

        CodeExecutionResponse response = new CodeExecutionResponse();

        response.setToken(text(result, "token"));
        response.setStdout(text(result, "stdout"));
        response.setStderr(text(result, "stderr"));
        response.setCompileOutput(text(result, "compile_output"));
        response.setMessage(text(result, "message"));
        response.setTime(text(result, "time"));

        if (result.hasNonNull("memory")) {
            response.setMemory(result.get("memory").asLong());
        }

        JsonNode status = result.get("status");

        if (status != null && !status.isNull()) {
            if (status.has("id")) {
                response.setStatusId(status.get("id").asInt());
            }

            if (status.has("description")) {
                response.setStatus(status.get("description").asText());
            }
        }

        return response;
    }

    private String text(JsonNode node, String field) {

        JsonNode value = node.get(field);

        if (value == null || value.isNull()) {
            return null;
        }

        return value.asText();
    }

    private static class SetOfLanguages {

        private static final java.util.Set<Integer> SUPPORTED =
                java.util.Set.of(
                        50, // C GCC
                        54, // C++ GCC
                        62, // Java
                        63, // JavaScript
                        71  // Python
                );
    }
}