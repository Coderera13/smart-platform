package com.smartproject.backend.service.programming;

import com.smartproject.backend.dto.programming.request.ProgrammingTestCaseRequest;
import com.smartproject.backend.dto.programming.response.ProgrammingTestCaseResponse;

import java.util.List;

public interface ProgrammingTestCaseService {

    ProgrammingTestCaseResponse createTestCase(
            ProgrammingTestCaseRequest request
    );

    List<ProgrammingTestCaseResponse> getTestCasesByQuestionId(
            Long programmingQuestionId
    );

    ProgrammingTestCaseResponse getTestCaseById(Long id);

    ProgrammingTestCaseResponse updateTestCase(
            Long id,
            ProgrammingTestCaseRequest request
    );

    void deleteTestCase(Long id);
}