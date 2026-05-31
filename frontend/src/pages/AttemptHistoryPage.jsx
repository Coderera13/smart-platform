import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAttemptHistory } from "../api/attemptApi";

export default function AttemptHistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await fetchAttemptHistory();
        setAttempts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load attempt history");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) return <div className="p-6">Loading attempt history...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Attempt History</h1>

      {attempts.length === 0 ? (
        <div className="p-4 bg-white rounded-lg shadow">
          No attempts found.
        </div>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt) => (
            <div key={attempt.attemptId} className="p-4 bg-white rounded-lg shadow">
              <p className="font-semibold">{attempt.testTitle}</p>
              <p className="text-sm text-gray-600">Score: {attempt.score}</p>
              <p className="text-sm text-gray-600">
                Status: {attempt.completed ? "Completed" : "In Progress"}
              </p>
              <Link
                to={`/result/${attempt.attemptId}`}
                className="text-blue-600 underline mt-2 inline-block"
              >
                View Result
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}