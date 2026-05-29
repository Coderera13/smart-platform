package com.smartproject.backend.repository;

import com.smartproject.backend.entity.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentAnswerRepository
        extends JpaRepository<StudentAnswer, Long> {

    List<StudentAnswer> findByTestAttemptId(Long attemptId);
}