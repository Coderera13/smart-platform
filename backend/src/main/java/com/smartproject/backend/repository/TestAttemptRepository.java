package com.smartproject.backend.repository;

import com.smartproject.backend.entity.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {

    Optional<TestAttempt> findByIdAndUser_Email(Long id, String email);

    List<TestAttempt> findByUser_EmailOrderByStartedAtDesc(String email);

    List<TestAttempt> findByTest_IdAndCompletedTrueOrderByScoreDesc(Long testId);

    @Query("""
           select ta
           from TestAttempt ta
           where ta.test.id = :testId
             and ta.completed = true
           order by ta.score desc, ta.submittedAt asc
           """)
    List<TestAttempt> findCompletedAttemptsForLeaderboard(
            @Param("testId") Long testId
    );

    @Query("""
           select count(ta)
           from TestAttempt ta
           where ta.test.id = :testId
           """)
    Long countAttemptsByTestId(
            @Param("testId") Long testId
    );

    @Query("""
           select count(ta)
           from TestAttempt ta
           where ta.test.id = :testId
             and ta.completed = true
           """)
    Long countCompletedAttemptsByTestId(
            @Param("testId") Long testId
    );

    @Query("""
           select coalesce(avg(ta.score), 0)
           from TestAttempt ta
           where ta.test.id = :testId
             and ta.completed = true
           """)
    Double findAverageScoreByTestId(
            @Param("testId") Long testId
    );

    @Query("""
           select coalesce(max(ta.score), 0)
           from TestAttempt ta
           where ta.test.id = :testId
             and ta.completed = true
           """)
    Integer findHighestScoreByTestId(
            @Param("testId") Long testId
    );

    @Query("""
           select coalesce(min(ta.score), 0)
           from TestAttempt ta
           where ta.test.id = :testId
             and ta.completed = true
           """)
    Integer findLowestScoreByTestId(
            @Param("testId") Long testId
    );
}