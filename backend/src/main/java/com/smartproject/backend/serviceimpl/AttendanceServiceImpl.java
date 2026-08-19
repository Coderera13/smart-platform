package com.smartproject.backend.serviceimpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smartproject.backend.entity.Attendance;
import com.smartproject.backend.repository.AttendanceRepository;
import com.smartproject.backend.service.AttendanceService;

@Service
public class AttendanceServiceImpl
        implements AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceServiceImpl(
            AttendanceRepository attendanceRepository
    ) {
        this.attendanceRepository =
                attendanceRepository;
    }

    @Override
    public List<Attendance> getAttendanceForUser(
            Long userId
    ) {

        return attendanceRepository.findByUserId(userId);
    }
}