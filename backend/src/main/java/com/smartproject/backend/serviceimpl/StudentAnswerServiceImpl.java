package com.smartproject.backend.serviceimpl;

import com.smartproject.backend.dto.SubmitAnswerRequest;
import com.smartproject.backend.dto.SubmitAnswerResponse;
import com.smartproject.backend.entity.Option;
import com.smartproject.backend.entity.Question;
import com.smartproject.backend.entity.StudentAnswer;
import com.smartproject.backend.entity.TestAttempt;
import com.smartproject.backend.exception.ResourceNotFoundException;
import com.smartproject.backend.repository.OptionRepository;
import com.smartproject.backend.repository.QuestionRepository;
import com.smartproject.backend.repository.StudentAnswerRepository;
import com.smartproject.backend.repository.TestAttemptRepository;
import com.smartproject.backend.service.StudentAnswerService;
import org.springframework.stereotype.Service;

@Service
public class StudentAnswerServiceImpl implements StudentAnswerService {

    private final StudentAnswerRepository studentAnswerRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;

    public StudentAnswerServiceImpl(StudentAnswerRepository studentAnswerRepository,
                                    TestAttemptRepository testAttemptRepository,
                                    QuestionRepository questionRepository,
                                    OptionRepository optionRepository) {
        this.studentAnswerRepository = studentAnswerRepository;
        this.testAttemptRepository = testAttemptRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
    }

    @Override
    public SubmitAnswerResponse submitAnswer(SubmitAnswerRequest request) {

        TestAttempt attempt = testAttemptRepository.findById(request.getAttemptId())
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with id: " + request.getAttemptId()));

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + request.getQuestionId()));

        Option selectedOption = optionRepository.findById(request.getSelectedOptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Option not found with id: " + request.getSelectedOptionId()));

        StudentAnswer studentAnswer = StudentAnswer.builder()
                .testAttempt(attempt)
                .question(question)
                .selectedOption(selectedOption)
                .build();

        studentAnswerRepository.save(studentAnswer);

        return SubmitAnswerResponse.builder()
                .message("Answer submitted successfully")
                .build();
    }
}