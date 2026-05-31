import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getTests, startTest } from "../api/testApi";

function StudentTestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadTests = async () => {
      try {
        const data = await getTests();
        setTests(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load tests");
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  const handleStart = async (testId) => {
    try {
      const data = await startTest(testId);
      navigate(`/take-test/${data.attemptId}`, { state: data });
    } catch (err) {
      setError(err.message || "Failed to start test");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="p-6">Loading tests...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Available Tests</h1>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-900 text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className="p-4 rounded-xl border border-gray-700 bg-[#1a1a1a]"
            >
              <h2 className="text-xl font-semibold">{test.title}</h2>
              <p className="text-gray-400">{test.description}</p>
              <p className="mt-2">Duration: {test.durationMinutes} minutes</p>
              <p>Total Marks: {test.totalMarks}</p>

              <button
                onClick={() => handleStart(test.id)}
                className="mt-4 px-4 py-2 rounded bg-blue-600 text-white"
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentTestsPage;