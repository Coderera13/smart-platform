package com.smartproject.backend.service;

import java.util.List;

import com.smartproject.backend.dto.QuestionRequest;
import com.smartproject.backend.dto.QuestionResponse;

public interface QuestionService {
    QuestionResponse createQuestion(QuestionRequest request);
    QuestionResponse updateQuestion(Long id, QuestionRequest request);
    QuestionResponse getQuestionById(Long id);
    List<QuestionResponse> getAllQuestions();
    void deleteQuestion(Long id);
}