package com.smartproject.backend.repository.programming;

import com.smartproject.backend.entity.programming.ProgrammingTestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgrammingTestCaseRepository
        extends JpaRepository<ProgrammingTestCase, Long> {

    List<ProgrammingTestCase> findByProgrammingQuestionId(Long programmingQuestionId);

}