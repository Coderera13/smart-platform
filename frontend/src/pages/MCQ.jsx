import React, { useState } from "react";

const questions = [
  {
    question: "Which data structure follows FIFO?",
    options: [
      "Stack",
      "Queue",
      "Tree",
      "Graph",
    ],
    answer: "Queue",
  },
  {
    question: "Which language is primarily used with React?",
    options: [
      "Java",
      "Python",
      "JavaScript",
      "C++",
    ],
    answer: "JavaScript",
  },
  {
    question: "Which SQL command is used to retrieve data?",
    options: [
      "INSERT",
      "UPDATE",
      "SELECT",
      "DELETE",
    ],
    answer: "SELECT",
  },
];

export default function MCQ() {

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(null);

  const question = questions[current];

  const handleNext = () => {

    if (!selected) {
      return;
    }

    if (current === questions.length - 1) {

      const finalScore =
        questions.reduce((score, item, index) => {

          const selectedAnswer =
            index === current
              ? selected
              : "";

          return score +
            (selectedAnswer === item.answer ? 1 : 0);

        }, 0);

      setScore(finalScore);

      return;
    }

    setCurrent(current + 1);
    setSelected("");
  };

  return (
    <section className="page-section">

      <div className="page-heading">

        <div>
          <span className="page-eyebrow">
            Practice
          </span>

          <h1>
            MCQ Test
          </h1>

          <p>
            Test your technical knowledge.
          </p>
        </div>

        <div className="question-counter">
          {current + 1} / {questions.length}
        </div>

      </div>

      {score === null ? (

        <div className="mcq-card">

          <h2>
            {question.question}
          </h2>

          <div className="mcq-options">

            {question.options.map((option) => (

              <button
                key={option}
                className={
                  selected === option
                    ? "mcq-option selected"
                    : "mcq-option"
                }
                onClick={() => setSelected(option)}
              >
                <span>
                  {option}
                </span>
              </button>

            ))}

          </div>

          <button
            className="page-primary-btn"
            onClick={handleNext}
            disabled={!selected}
          >
            {current === questions.length - 1
              ? "Finish Test"
              : "Next Question"}
          </button>

        </div>

      ) : (

        <div className="result-message-card">

          <span className="result-big-icon">
            🎉
          </span>

          <h2>
            Test Completed
          </h2>

          <p>
            Your demo score is:
          </p>

          <strong>
            {score} / {questions.length}
          </strong>

        </div>
      )}
    </section>
  );
}