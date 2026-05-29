package com.smartproject.backend.service;

import com.smartproject.backend.dto.QuestionRequest;
import com.smartproject.backend.dto.QuestionResponse;

import java.util.List;

public interface QuestionService {
    QuestionResponse createQuestion(QuestionRequest request);
    QuestionResponse updateQuestion(Long id, QuestionRequest request);
    QuestionResponse getQuestionById(Long id);
    List<QuestionResponse> getAllQuestions();
    void deleteQuestion(Long id);
}