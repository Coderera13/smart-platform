import React from "react";

export default function About() {

  return (
    <section className="page-section">

      <div className="about-container">

        <span className="page-eyebrow">
          About Us
        </span>

        <h1>
          About Smart Interview
        </h1>

        <p className="about-intro">
          Smart Interview is an AI-powered college
          platform designed to help students prepare,
          practice and track their academic progress.
        </p>

        <div className="about-grid">

          <div className="about-card">

            <span>🎯</span>

            <h2>
              Our Mission
            </h2>

            <p>
              To provide students with a single platform
              for academic preparation, coding practice,
              assessments and performance tracking.
            </p>

          </div>

          <div className="about-card">

            <span>🤖</span>

            <h2>
              AI Powered
            </h2>

            <p>
              We aim to integrate intelligent tools that
              help students identify their strengths and
              areas that need improvement.
            </p>

          </div>

          <div className="about-card">

            <span>🚀</span>

            <h2>
              Built for Students
            </h2>

            <p>
              The platform brings attendance, MCQs,
              coding exercises and results together in
              one easy-to-use experience.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}