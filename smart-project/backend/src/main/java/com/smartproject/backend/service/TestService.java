package com.smartproject.backend.service;

import com.smartproject.backend.dto.TestRequest;
import com.smartproject.backend.dto.TestResponse;

import java.util.List;

public interface TestService {
    TestResponse createTest(TestRequest request);
    TestResponse updateTest(Long id, TestRequest request);
    TestResponse getTestById(Long id);
    List<TestResponse> getAllTests();
    void deleteTest(Long id);
}