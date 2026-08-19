import React from "react";

const results = [
  {
    title: "Data Structures MCQ",
    score: 86,
    date: "13 Aug 2026",
    type: "MCQ",
  },
  {
    title: "Java Programming",
    score: 78,
    date: "10 Aug 2026",
    type: "Coding",
  },
  {
    title: "Database Test",
    score: 92,
    date: "06 Aug 2026",
    type: "MCQ",
  },
];

export default function Results() {

  return (
    <section className="page-section">

      <div className="page-heading">

        <div>

          <span className="page-eyebrow">
            Performance
          </span>

          <h1>
            Results
          </h1>

          <p>
            Track your tests and coding performance.
          </p>

        </div>

      </div>

      <div className="result-summary-grid">

        <div className="summary-card">
          <span>Tests Taken</span>
          <strong>12</strong>
        </div>

        <div className="summary-card">
          <span>Average Score</span>
          <strong>84%</strong>
        </div>

        <div className="summary-card">
          <span>Best Score</span>
          <strong>96%</strong>
        </div>

        <div className="summary-card">
          <span>Coding Problems</span>
          <strong>28</strong>
        </div>

      </div>

      <div className="results-table-wrapper">

        <table className="results-table">

          <thead>

            <tr>
              <th>Test</th>
              <th>Type</th>
              <th>Score</th>
              <th>Date</th>
            </tr>

          </thead>

          <tbody>

            {results.map((result) => (

              <tr key={result.title}>

                <td>
                  {result.title}
                </td>

                <td>
                  <span className="result-type">
                    {result.type}
                  </span>
                </td>

                <td>
                  <strong className="score-value">
                    {result.score}%
                  </strong>
                </td>

                <td>
                  {result.date}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}
