package com.smartproject.backend.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String questionText;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private String difficulty;

    @Column(length = 1000)
    private String explanation;

    @Column(nullable = false)
    @Builder.Default
    private String questionType = "MCQ";

    @Column(columnDefinition = "TEXT")
    private String codeTemplate;

    private Integer defaultLanguageId;

    @Column(columnDefinition = "TEXT")
    private String allowedLanguages;

    @OneToMany(
            mappedBy = "question",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<Option> options = new ArrayList<>();

    @OneToMany(
            mappedBy = "question",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<CodingTestCase> codingTestCases = new ArrayList<>();

    @ManyToMany(mappedBy = "questions")
    @Builder.Default
    private List<Test> tests = new ArrayList<>();
}