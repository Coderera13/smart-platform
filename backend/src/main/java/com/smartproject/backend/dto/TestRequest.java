package com.smartproject.backend.dto;

import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Duration is required")
    private Integer durationMinutes;

    @NotNull(message = "Total marks is required")
    private Integer totalMarks;

    private List<Long> questionIds;
}