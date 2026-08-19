package com.smartproject.backend.entity.programming;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "programming_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammingQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Question Title
    @Column(nullable = false)
    private String title;

    // Complete Programming Problem
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    // Arrays, Strings, Graphs...
    @Column(nullable = false)
    private String topic;

    // EASY, MEDIUM, HARD
    @Column(nullable = false)
    private String difficulty;

    // Total Marks
    @Column(nullable = false)
    private Integer marks;

    // Time Limit (milliseconds)
    @Column(nullable = false)
    @Builder.Default
    private Integer timeLimit = 1000;

    // Memory Limit (MB)
    @Column(nullable = false)
    @Builder.Default
    private Integer memoryLimit = 256;

    // Starter Code displayed in editor
    @Column(columnDefinition = "TEXT")
    private String starterCode;

    // Constraints section
    @Column(columnDefinition = "TEXT")
    private String constraints;

    // Created Time
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // One Programming Question -> Many Test Cases
    @OneToMany(
            mappedBy = "programmingQuestion",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<ProgrammingTestCase> testCases = new ArrayList<>();

    // One Programming Question -> Many Submissions
    @OneToMany(
            mappedBy = "programmingQuestion",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<ProgrammingSubmission> submissions = new ArrayList<>();
}