package com.smartproject.backend.entity.programming;

import com.smartproject.backend.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "programming_submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammingSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Student who submitted
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Question attempted
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programming_question_id", nullable = false)
    private ProgrammingQuestion programmingQuestion;

    // Java, Python, C++, etc.
    @Column(nullable = false)
    private String language;

    // Student's code
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String sourceCode;

    // Accepted, Wrong Answer, Runtime Error...
    @Column(nullable = false)
    private String status;

    // Marks obtained
    @Builder.Default
    @Column(nullable = false)
    private Integer score = 0;

    // Execution time in milliseconds
    @Builder.Default
    private Double executionTime = 0.0;

    // Memory usage in KB
    @Builder.Default
    private Integer memoryUsed = 0;

    // Submission timestamp
    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();
}