package com.smartproject.backend.serviceImpl.programming;

import com.smartproject.backend.dto.programming.request.ProgrammingQuestionRequest;
import com.smartproject.backend.dto.programming.response.ProgrammingQuestionResponse;
import com.smartproject.backend.entity.programming.ProgrammingQuestion;
import com.smartproject.backend.repository.programming.ProgrammingQuestionRepository;
import com.smartproject.backend.service.programming.ProgrammingQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgrammingQuestionServiceImpl
        implements ProgrammingQuestionService {

    private final ProgrammingQuestionRepository programmingQuestionRepository;

    @Override
    public ProgrammingQuestionResponse createQuestion(
            ProgrammingQuestionRequest request) {

        ProgrammingQuestion question = ProgrammingQuestion.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .topic(request.getTopic())
                .difficulty(request.getDifficulty())
                .marks(request.getMarks())
                .timeLimit(request.getTimeLimit())
                .memoryLimit(request.getMemoryLimit())
                .starterCode(request.getStarterCode())
                .constraints(request.getConstraints())
                .build();

        ProgrammingQuestion savedQuestion =
                programmingQuestionRepository.save(question);

        return mapToResponse(savedQuestion);
    }

    @Override
    public List<ProgrammingQuestionResponse> getAllQuestions() {

        return programmingQuestionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProgrammingQuestionResponse getQuestionById(Long id) {

        ProgrammingQuestion question =
                programmingQuestionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Programming question not found with id: " + id
                                )
                        );

        return mapToResponse(question);
    }

    @Override
    public ProgrammingQuestionResponse updateQuestion(
            Long id,
            ProgrammingQuestionRequest request) {

        ProgrammingQuestion question =
                programmingQuestionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Programming question not found with id: " + id
                                )
                        );

        question.setTitle(request.getTitle());
        question.setDescription(request.getDescription());
        question.setTopic(request.getTopic());
        question.setDifficulty(request.getDifficulty());
        question.setMarks(request.getMarks());
        question.setTimeLimit(request.getTimeLimit());
        question.setMemoryLimit(request.getMemoryLimit());
        question.setStarterCode(request.getStarterCode());
        question.setConstraints(request.getConstraints());

        ProgrammingQuestion updatedQuestion =
                programmingQuestionRepository.save(question);

        return mapToResponse(updatedQuestion);
    }

    @Override
    public void deleteQuestion(Long id) {

        if (!programmingQuestionRepository.existsById(id)) {
            throw new RuntimeException(
                    "Programming question not found with id: " + id
            );
        }

        programmingQuestionRepository.deleteById(id);
    }

    private ProgrammingQuestionResponse mapToResponse(
            ProgrammingQuestion question) {

        return ProgrammingQuestionResponse.builder()
                .id(question.getId())
                .title(question.getTitle())
                .description(question.getDescription())
                .topic(question.getTopic())
                .difficulty(question.getDifficulty())
                .marks(question.getMarks())
                .timeLimit(question.getTimeLimit())
                .memoryLimit(question.getMemoryLimit())
                .starterCode(question.getStarterCode())
                .constraints(question.getConstraints())
                .build();
    }
}