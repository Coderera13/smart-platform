package com.smartproject.backend.service.programming;

import java.util.List;

import com.smartproject.backend.dto.programming.request.ProgrammingSubmissionRequest;
import com.smartproject.backend.dto.programming.response.ProgrammingSubmissionResponse;
import com.smartproject.backend.dto.programming.response.RunCodeResponse;

public interface ProgrammingSubmissionService {

    RunCodeResponse runCode(
            ProgrammingSubmissionRequest request
    );

    ProgrammingSubmissionResponse submitCode(
            ProgrammingSubmissionRequest request
    );

    List<ProgrammingSubmissionResponse> getMySubmissions();

    ProgrammingSubmissionResponse getSubmissionById(Long id);
}