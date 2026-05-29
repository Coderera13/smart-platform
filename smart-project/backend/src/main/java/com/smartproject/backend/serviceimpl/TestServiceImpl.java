package com.smartproject.backend.serviceimpl;

import com.smartproject.backend.dto.TestRequest;
import com.smartproject.backend.dto.TestResponse;
import com.smartproject.backend.entity.Question;
import com.smartproject.backend.entity.Test;
import com.smartproject.backend.exception.ResourceNotFoundException;
import com.smartproject.backend.repository.QuestionRepository;
import com.smartproject.backend.repository.TestRepository;
import com.smartproject.backend.service.TestService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TestServiceImpl implements TestService {

    private final TestRepository testRepository;
    private final QuestionRepository questionRepository;

    public TestServiceImpl(TestRepository testRepository,
                           QuestionRepository questionRepository) {
        this.testRepository = testRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    public TestResponse createTest(TestRequest request) {

        List<Question> questions = new ArrayList<>();
        if (request.getQuestionIds() != null) {
            questions = questionRepository.findAllById(request.getQuestionIds());
        }

        Test test = Test.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .durationMinutes(request.getDurationMinutes())
                .totalMarks(request.getTotalMarks())
                .questions(questions)
                .build();

        Test savedTest = testRepository.save(test);
        return mapToResponse(savedTest);
    }

    @Override
    public TestResponse updateTest(Long id, TestRequest request) {

        Test test = testRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found with id: " + id));

        test.setTitle(request.getTitle());
        test.setDescription(request.getDescription());
        test.setDurationMinutes(request.getDurationMinutes());
        test.setTotalMarks(request.getTotalMarks());

        List<Question> questions = new ArrayList<>();
        if (request.getQuestionIds() != null) {
            questions = questionRepository.findAllById(request.getQuestionIds());
        }

        test.setQuestions(questions);

        Test updatedTest = testRepository.save(test);
        return mapToResponse(updatedTest);
    }

    @Override
    public TestResponse getTestById(Long id) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found with id: " + id));

        return mapToResponse(test);
    }

    @Override
    public List<TestResponse> getAllTests() {
        return testRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void deleteTest(Long id) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found with id: " + id));

        testRepository.delete(test);
    }

    private TestResponse mapToResponse(Test test) {

        List<Long> questionIds = test.getQuestions()
                .stream()
                .map(Question::getId)
                .toList();

        return TestResponse.builder()
                .id(test.getId())
                .title(test.getTitle())
                .description(test.getDescription())
                .durationMinutes(test.getDurationMinutes())
                .totalMarks(test.getTotalMarks())
                .createdAt(test.getCreatedAt())
                .questionIds(questionIds)
                .build();
    }
}