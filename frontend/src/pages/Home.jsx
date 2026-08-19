import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();

  return (
    <section className="home-page">

      <div className="home-hero">

        <div className="home-hero-text">

          <span className="home-badge">
            AI Powered College Platform
          </span>

          <h1>
            Welcome to
            <span> Smart Interview </span>
            🎉
          </h1>

          <p>
            Manage your attendance, practice MCQs,
            solve coding problems and track your
            performance from one platform.
          </p>

          <div className="home-actions">

            <button
              className="page-primary-btn"
              onClick={() => navigate("/mcq")}
            >
              Start MCQ Test
            </button>

            <button
              className="page-secondary-btn"
              onClick={() => navigate("/coding")}
            >
              Practice Coding
            </button>

          </div>

        </div>

      </div>

      <div className="feature-grid">

        <button
          className="feature-card"
          onClick={() => navigate("/attendance")}
        >
          <span className="feature-icon">📊</span>

          <h2>Attendance</h2>

          <p>
            Track your subject-wise attendance
            and stay on top of your classes.
          </p>
        </button>

        <button
          className="feature-card"
          onClick={() => navigate("/mcq")}
        >
          <span className="feature-icon">📝</span>

          <h2>MCQ Practice</h2>

          <p>
            Test your knowledge with subject-wise
            multiple-choice questions.
          </p>
        </button>

        <button
          className="feature-card"
          onClick={() => navigate("/coding")}
        >
          <span className="feature-icon">💻</span>

          <h2>Coding</h2>

          <p>
            Solve programming problems and
            improve your coding skills.
          </p>
        </button>

        <button
          className="feature-card"
          onClick={() => navigate("/results")}
        >
          <span className="feature-icon">🏆</span>

          <h2>Results</h2>

          <p>
            View your test scores and
            performance history.
          </p>
        </button>

      </div>

    </section>
  );
}