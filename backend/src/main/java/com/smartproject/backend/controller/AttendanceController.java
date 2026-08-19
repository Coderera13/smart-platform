package com.smartproject.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartproject.backend.entity.Attendance;
import com.smartproject.backend.entity.User;
import com.smartproject.backend.repository.UserRepository;
import com.smartproject.backend.service.AttendanceService;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(
        origins = "http://localhost:5173"
)
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final UserRepository userRepository;

    public AttendanceController(
            AttendanceService attendanceService,
            UserRepository userRepository
    ) {
        this.attendanceService = attendanceService;
        this.userRepository = userRepository;
    }

    @GetMapping("/my")
    public ResponseEntity<List<Attendance>> getMyAttendance(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        return ResponseEntity.ok(
                attendanceService.getAttendanceForUser(
                        user.getId()
                )
        );
    }
}