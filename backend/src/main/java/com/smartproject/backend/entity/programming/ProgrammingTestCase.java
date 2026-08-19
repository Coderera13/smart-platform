package com.smartproject.backend.entity.programming;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "programming_test_cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammingTestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Input provided to the program
    @Column(nullable = false, columnDefinition = "TEXT")
    private String input;

    // Expected output
    @Column(nullable = false, columnDefinition = "TEXT")
    private String expectedOutput;

    // Public or Hidden Test Case
    @Builder.Default
    @Column(nullable = false)
    private Boolean hidden = false;

    // Many Test Cases belong to one Programming Question
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programming_question_id", nullable = false)
    private ProgrammingQuestion programmingQuestion;
}