package com.smartproject.backend.service;

import com.smartproject.backend.dto.SubmitAnswerRequest;
import com.smartproject.backend.dto.SubmitAnswerResponse;

public interface StudentAnswerService {
    SubmitAnswerResponse submitAnswer(SubmitAnswerRequest request);
}