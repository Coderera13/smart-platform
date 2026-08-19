package com.smartproject.backend.repository.programming;

import com.smartproject.backend.entity.programming.ProgrammingSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgrammingSubmissionRepository
        extends JpaRepository<ProgrammingSubmission, Long> {

    List<ProgrammingSubmission> findByUserId(Long userId);

    List<ProgrammingSubmission> findByProgrammingQuestionId(Long programmingQuestionId);

}