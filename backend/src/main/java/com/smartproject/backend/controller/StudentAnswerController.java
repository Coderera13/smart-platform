package com.smartproject.backend.controller;

import com.smartproject.backend.dto.SubmitAnswerRequest;
import com.smartproject.backend.dto.SubmitAnswerResponse;
import com.smartproject.backend.service.StudentAnswerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attempts")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentAnswerController {

    private final StudentAnswerService studentAnswerService;

    public StudentAnswerController(StudentAnswerService studentAnswerService) {
        this.studentAnswerService = studentAnswerService;
    }

    @PostMapping("/submit-answer")
    public ResponseEntity<SubmitAnswerResponse> submitAnswer(
            @Valid @RequestBody SubmitAnswerRequest request
    ) {

        return ResponseEntity.ok(
                studentAnswerService.submitAnswer(request)
        );
    }
}