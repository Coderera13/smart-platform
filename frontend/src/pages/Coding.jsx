import React, { useEffect, useState } from "react";

import {
  getProgrammingQuestion,
  runProgrammingCode,
  submitProgrammingCode,
  apiFetch
} from "../api";

const QUESTION_ID = 1;

export default function Coding() {

  const [question, setQuestion] = useState(null);

  const [code, setCode] = useState("");

  const [input, setInput] = useState("");

  const [language, setLanguage] = useState("JAVA");

  const [output, setOutput] = useState("");

  const [customInput, setCustomInput] = useState("10 20");

  const [error, setError] = useState("");

  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);

  const [running, setRunning] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [submitResult, setSubmitResult] = useState(null);

  // ============================================================
  // LOAD PROGRAMMING QUESTION
  // ============================================================

  useEffect(() => {

    async function loadQuestion() {

      try {

        setLoading(true);

        setError("");

        const data = await getProgrammingQuestion(QUESTION_ID);

        setQuestion(data);

        setCode(data.starterCode || "");

      } catch (err) {

        console.error(err);

        setError(
          err.message || "Failed to load programming question."
        );

      } finally {

        setLoading(false);

      }
    }

    loadQuestion();

  }, []);


  // ============================================================
  // RUN CODE
  // ============================================================

  const runCode = async () => {
    if (!code.trim()) {
      setError("Please write some code first.");
      return;
    }

    try {
      setRunning(true);
      setOutput("");
      setError("");
      setStatus("Running...");

      const response = await apiFetch(
        "/api/programming/submissions/run",
        {
          method: "POST",
          body: JSON.stringify({
            programmingQuestionId: QUESTION_ID,
            language: language,
            sourceCode: code,
            stdin: customInput,
          }),
        }
      );

      setStatus(response.status || "");

      if (response.error) {
        setOutput(response.error);
      } else {
        setOutput(response.output || "No output");
      }

    } catch (err) {
      console.error(err);

      setStatus("Execution Failed");
      setError(
        err.message || "Code execution failed."
      );

    } finally {
      setRunning(false);
    }
  };

  // ============================================================
  // SUBMIT CODE
  // ============================================================

  const submitCode = async () => {

    if (!code.trim()) {

      setError("Please write some code first.");

      return;
    }

    try {

      setSubmitting(true);

      setOutput("");

      setError("");

      setStatus("Submitting...");

      setSubmitResult(null);

      const result = await submitProgrammingCode({

        programmingQuestionId: QUESTION_ID,

        language,

        sourceCode: code,

      });


      setSubmitResult(result);

      setStatus(result.status || "");

    } catch (err) {

      console.error(err);

      setStatus("Submission Failed");

      setError(
        err.message || "Code submission failed."
      );

    } finally {

      setSubmitting(false);

    }
  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (
      <section className="page-section">

        <div className="page-loading">

          Loading programming question...

        </div>

      </section>
    );
  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error && !question) {

    return (
      <section className="page-section">

        <div className="page-error">

          {error}

        </div>

      </section>
    );
  }


  // ============================================================
  // PAGE
  // ============================================================

  return (

    <section className="page-section">

      <div className="page-heading">

        <div>

          <span className="page-eyebrow">
            Practice
          </span>

          <h1>
            Coding Arena
          </h1>

          <p>
            Solve programming problems and test
            your solutions.
          </p>

        </div>

      </div>


      <div className="coding-layout">


        {/* ======================================================
            PROBLEM PANEL
        ====================================================== */}

        <div className="problem-panel">

          <span className="coding-difficulty">

            {question?.difficulty || "Unknown"}

          </span>


          <h2>

            {question?.title || "Programming Question"}

          </h2>


          <p>

            {question?.description ||
              "No description available."}

          </p>


          <h3>
            Constraints
          </h3>


          <pre>

            {question?.constraints ||
              "No constraints provided."}

          </pre>


          <h3>
            Marks
          </h3>


          <p>

            {question?.marks ?? 0} marks

          </p>


          <h3>
            Time Limit
          </h3>


          <p>

            {question?.timeLimit ?? 0} ms

          </p>


          <h3>
            Memory Limit
          </h3>


          <p>

            {question?.memoryLimit ?? 0} MB

          </p>


          <h3>
            Starter Code
          </h3>


          <pre>

            {question?.starterCode || "No starter code."}

          </pre>

        </div>


        {/* ======================================================
            EDITOR PANEL
        ====================================================== */}

        <div className="editor-panel">


          {/* EDITOR HEADER */}

          <div className="editor-header">


            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              disabled={running || submitting}
            >

              <option value="JAVA">
                Java
              </option>

              <option value="PYTHON">
                Python
              </option>

              <option value="CPP">
                C++
              </option>

              <option value="C">
                C
              </option>

              <option value="JAVASCRIPT">
                JavaScript
              </option>

            </select>


            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >

              <button
                className="page-secondary-btn"
                onClick={runCode}
                disabled={running || submitting}
              >

                {running
                  ? "Running..."
                  : "▶ Run Code"}

              </button>


              <button
                className="page-primary-btn"
                onClick={submitCode}
                disabled={running || submitting}
              >

                {submitting
                  ? "Submitting..."
                  : "Submit"}

              </button>

            </div>

          </div>


          {/* CODE EDITOR */}

          <textarea
            className="code-editor"
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
            spellCheck="false"
            disabled={running || submitting}
          />


          {/* INPUT */}

          <div className="console-panel">

            <div className="console-title">

              Custom Input

            </div>


            <textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Enter program input..."
              style={{
                width: "100%",
                minHeight: "70px",
                resize: "vertical",
                padding: "10px",
                borderRadius: "8px",
                border:
                  "1px solid rgba(255,255,255,0.12)",
                background: "#050711",
                color: "#ffffff",
                fontFamily: "monospace",
              }}
            />

          </div>

          {/* OUTPUT */}

          <div className="console-panel">

            <div className="console-title">

              Output

            </div>


            {status && (

              <div
                style={{
                  marginBottom: "8px",
                  color:
                    status === "Accepted"
                      ? "#4ade80"
                      : "#ff5c99",
                }}
              >

                Status: {status}

              </div>

            )}


            <pre>

              {output ||
                error ||
                "Run your code to see output..."}

            </pre>

          </div>


          {/* SUBMISSION RESULT */}

          {submitResult && (

            <div className="console-panel">

              <div className="console-title">

                Submission Result

              </div>


              <pre>

{`Status: ${submitResult.status}
Score: ${submitResult.score}
Execution Time: ${submitResult.executionTime} ms
Memory Used: ${submitResult.memoryUsed} KB`}

              </pre>

            </div>

          )}

        </div>

      </div>

    </section>

  );
}