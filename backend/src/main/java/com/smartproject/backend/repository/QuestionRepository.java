package com.smartproject.backend.repository;

import com.smartproject.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}