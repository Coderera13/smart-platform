package com.smartproject.backend.repository;

import com.smartproject.backend.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OptionRepository extends JpaRepository<Option, Long> {
}