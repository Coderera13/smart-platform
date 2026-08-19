package com.smartproject.backend.repository.programming;

import com.smartproject.backend.entity.programming.ProgrammingQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgrammingQuestionRepository
        extends JpaRepository<ProgrammingQuestion, Long> {

}