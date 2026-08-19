package com.smartproject.backend.service;

import java.util.List;

import com.smartproject.backend.entity.Attendance;

public interface AttendanceService {

    List<Attendance> getAttendanceForUser(Long userId);

}