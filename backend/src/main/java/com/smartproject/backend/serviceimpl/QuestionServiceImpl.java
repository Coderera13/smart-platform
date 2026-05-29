package com.smartproject.backend.serviceimpl;

import com.smartproject.backend.dto.OptionRequest;
import com.smartproject.backend.dto.OptionResponse;
import com.smartproject.backend.dto.QuestionRequest;
import com.smartproject.backend.dto.QuestionResponse;
import com.smartproject.backend.entity.Option;
import com.smartproject.backend.entity.Question;
import com.smartproject.backend.exception.ResourceNotFoundException;
import com.smartproject.backend.repository.QuestionRepository;
import com.smartproject.backend.service.QuestionService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionServiceImpl(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Override
    public QuestionResponse createQuestion(QuestionRequest request) {
        Question question = new Question();
        question.setQuestionText(request.getQuestionText());
        question.setTopic(request.getTopic());
        question.setDifficulty(request.getDifficulty());
        question.setExplanation(request.getExplanation());

        List<Option> options = request.getOptions().stream().map(opt -> {
            Option option = new Option();
            option.setOptionText(opt.getOptionText());
            option.setCorrect(opt.isCorrect());
            option.setQuestion(question);
            return option;
        }).collect(Collectors.toList());

        question.setOptions(options);

        Question saved = questionRepository.save(question);
        return mapToResponse(saved);
    }

    @Override
    public QuestionResponse updateQuestion(Long id, QuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));

        question.setQuestionText(request.getQuestionText());
        question.setTopic(request.getTopic());
        question.setDifficulty(request.getDifficulty());
        question.setExplanation(request.getExplanation());

        question.getOptions().clear();

        List<Option> options = request.getOptions().stream().map(opt -> {
            Option option = new Option();
            option.setOptionText(opt.getOptionText());
            option.setCorrect(opt.isCorrect());
            option.setQuestion(question);
            return option;
        }).collect(Collectors.toList());

        question.getOptions().addAll(options);

        Question updated = questionRepository.save(question);
        return mapToResponse(updated);
    }

    @Override
    public QuestionResponse getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        return mapToResponse(question);
    }

    @Override
    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void deleteQuestion(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        questionRepository.delete(question);
    }

    private QuestionResponse mapToResponse(Question question) {
        List<OptionResponse> optionResponses = question.getOptions()
                .stream()
                .map(opt -> new OptionResponse(opt.getId(), opt.getOptionText(), opt.isCorrect()))
                .collect(Collectors.toList());

        return new QuestionResponse(
                question.getId(),
                question.getQuestionText(),
                question.getTopic(),
                question.getDifficulty(),
                question.getExplanation(),
                optionResponses
        );
    }
}