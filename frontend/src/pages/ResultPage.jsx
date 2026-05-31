import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAttemptResult, fetchAttemptReview } from "../api/attemptApi";

export default function ResultPage() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [resultData, reviewData] = await Promise.all([
          fetchAttemptResult(attemptId),
          fetchAttemptReview(attemptId),
        ]);

        setResult(resultData);
        setReview(Array.isArray(reviewData) ? reviewData : []);
      } catch (err) {
        setError(err.message || "Failed to load result");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [attemptId]);

  if (loading) return <div className="p-6">Loading result...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!result) return <div className="p-6">No result found.</div>;

  const percentage = result.totalQuestions
    ? Math.round((result.score / result.totalQuestions) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Result</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Test</p>
          <p className="text-lg font-semibold">{result.testTitle}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Score</p>
          <p className="text-lg font-semibold">{result.score}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Questions</p>
          <p className="text-lg font-semibold">{result.totalQuestions}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Percentage</p>
          <p className="text-lg font-semibold">{percentage}%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Question Review</h2>

        {review.length === 0 ? (
          <p className="text-gray-600">No review data found.</p>
        ) : (
          <div className="space-y-4">
            {review.map((item, index) => (
              <div key={item.questionId} className="border rounded-lg p-4">
                <p className="font-medium mb-2">
                  {index + 1}. {item.questionText}
                </p>
                <p className="text-green-600">
                  Correct: {item.correctOptionText}
                </p>
                <p className="text-red-600">
                  Your Answer: {item.selectedOptionText || "Not answered"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {item.correct ? "Correct" : "Wrong"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}