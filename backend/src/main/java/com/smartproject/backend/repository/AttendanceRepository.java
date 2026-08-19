package com.smartproject.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartproject.backend.entity.Attendance;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    List<Attendance> findByUserId(Long userId);
}