import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { submitAnswer, finishAttempt } from "../api/studentAnswerApi";

function TakeTestPage() {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const startData = location.state;
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!startData) {
    return (
      <div>
        <Navbar />
        <div className="p-6">
          Test data not found. Start the test again from Available Tests.
        </div>
      </div>
    );
  }

  const handleSelect = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");

      const questions = startData.questions || [];

      for (const question of questions) {
        const selectedOptionId = answers[question.id];

        if (!selectedOptionId) {
          continue;
        }

        await submitAnswer({
          attemptId: Number(attemptId),
          questionId: question.id,
          selectedOptionId,
        });
      }

      await finishAttempt(Number(attemptId));
      navigate(`/result/${attemptId}`);
    } catch (err) {
      setError(err.message || "Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{startData.title}</h1>
        <p className="text-gray-400 mb-6">{startData.description}</p>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-900 text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {startData.questions?.map((question, index) => (
            <div
              key={question.id}
              className="p-4 rounded-xl border border-gray-700 bg-[#1a1a1a]"
            >
              <h2 className="text-xl font-semibold mb-3">
                {index + 1}. {question.questionText}
              </h2>

              <div className="space-y-2">
                {question.options?.map((option) => (
                  <label key={option.id} className="block">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => handleSelect(question.id, option.id)}
                      className="mr-2"
                    />
                    {option.optionText}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 px-5 py-2 rounded bg-green-600 text-white disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Test"}
        </button>
      </div>
    </div>
  );
}

export default TakeTestPage;