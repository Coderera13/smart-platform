package com.smartproject.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartproject.backend.entity.CodingTestCase;

public interface CodingTestCaseRepository
        extends JpaRepository<CodingTestCase, Long> {

    List<CodingTestCase> findByQuestionId(Long questionId);
}