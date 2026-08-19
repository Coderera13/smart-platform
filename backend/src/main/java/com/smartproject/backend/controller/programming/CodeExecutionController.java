package com.smartproject.backend.controller.programming;

import com.smartproject.backend.dto.programming.request.CodeExecutionRequest;
import com.smartproject.backend.dto.programming.response.CodeExecutionResponse;
import com.smartproject.backend.service.programming.Judge0Service;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/code")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class CodeExecutionController {

    private final Judge0Service judge0Service;

    public CodeExecutionController(Judge0Service judge0Service) {
        this.judge0Service = judge0Service;
    }

    @PostMapping("/execute")
    public ResponseEntity<CodeExecutionResponse> executeCode(
            @Valid @RequestBody CodeExecutionRequest request
    ) {

        return ResponseEntity.ok(
                judge0Service.execute(request)
        );
    }
}