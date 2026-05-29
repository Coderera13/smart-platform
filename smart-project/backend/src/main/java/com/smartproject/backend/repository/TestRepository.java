package com.smartproject.backend.repository;

import com.smartproject.backend.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestRepository extends JpaRepository<Test, Long> {
}