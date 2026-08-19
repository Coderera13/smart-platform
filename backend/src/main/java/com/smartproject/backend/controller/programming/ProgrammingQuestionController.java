package com.smartproject.backend.controller.programming;

import com.smartproject.backend.dto.programming.request.ProgrammingQuestionRequest;
import com.smartproject.backend.dto.programming.response.ProgrammingQuestionResponse;
import com.smartproject.backend.service.programming.ProgrammingQuestionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programming/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173"
})
public class ProgrammingQuestionController {

    private final ProgrammingQuestionService programmingQuestionService;

    // ============================================================
    // CREATE QUESTION
    // ============================================================

    @PostMapping
    public ResponseEntity<ProgrammingQuestionResponse> createQuestion(
            @Valid @RequestBody ProgrammingQuestionRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(programmingQuestionService.createQuestion(request));
    }

    // ============================================================
    // GET ALL QUESTIONS
    // ============================================================

    @GetMapping
    public ResponseEntity<List<ProgrammingQuestionResponse>> getAllQuestions() {

        return ResponseEntity.ok(
                programmingQuestionService.getAllQuestions()
        );
    }

    // ============================================================
    // GET QUESTION BY ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<ProgrammingQuestionResponse> getQuestionById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                programmingQuestionService.getQuestionById(id)
        );
    }

    // ============================================================
    // UPDATE QUESTION
    // ============================================================

    @PutMapping("/{id}")
    public ResponseEntity<ProgrammingQuestionResponse> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody ProgrammingQuestionRequest request) {

        return ResponseEntity.ok(
                programmingQuestionService.updateQuestion(id, request)
        );
    }

    // ============================================================
    // DELETE QUESTION
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long id) {

        programmingQuestionService.deleteQuestion(id);

        return ResponseEntity.noContent().build();
    }
}
