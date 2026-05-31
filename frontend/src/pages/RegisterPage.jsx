import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAttemptResult } from "../api/attemptApi";

export default function ResultPage() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResult() {
      try {
        const data = await fetchAttemptResult(attemptId);
        setResult(data);
      } catch (err) {
        setError(err.message || "Failed to load result");
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [attemptId]);

  if (loading) return <div>Loading result...</div>;
  if (error) return <div>{error}</div>;
  if (!result) return <div>No result found</div>;

  return (
    <div>
      <h1>Test Result</h1>
      <p>Test: {result.testTitle}</p>
      <p>Score: {result.score}</p>
      <p>Total: {result.totalMarks}</p>
    </div>
  );
}