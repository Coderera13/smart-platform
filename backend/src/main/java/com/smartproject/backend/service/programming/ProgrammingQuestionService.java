package com.smartproject.backend.service.programming;

import com.smartproject.backend.dto.programming.request.ProgrammingQuestionRequest;
import com.smartproject.backend.dto.programming.response.ProgrammingQuestionResponse;

import java.util.List;

public interface ProgrammingQuestionService {

    ProgrammingQuestionResponse createQuestion(
            ProgrammingQuestionRequest request
    );

    List<ProgrammingQuestionResponse> getAllQuestions();

    ProgrammingQuestionResponse getQuestionById(Long id);

    ProgrammingQuestionResponse updateQuestion(
            Long id,
            ProgrammingQuestionRequest request
    );

    void deleteQuestion(Long id);
}