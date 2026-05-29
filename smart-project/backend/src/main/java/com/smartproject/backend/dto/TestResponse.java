package com.smartproject.backend.dto;

import lombok.*;
import java.util.List;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestResponse {

    private Long id;
    private String title;
    private String description;
    private Integer durationMinutes;
    private Integer totalMarks;
    private LocalDateTime createdAt;
    private List<Long> questionIds;
}