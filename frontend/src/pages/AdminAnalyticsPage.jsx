import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getTests } from "../api/testApi";
import { fetchTestAnalytics } from "../api/analyticsApi";

function AdminAnalyticsPage() {
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTests = async () => {
      try {
        const data = await getTests();
        setTests(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load tests");
      } finally {
        setPageLoading(false);
      }
    };

    loadTests();
  }, []);

  const handleFetchAnalytics = async () => {
    if (!selectedTestId) {
      setError("Please select a test first");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await fetchTestAnalytics(selectedTestId);
      setAnalytics(data);
    } catch (err) {
      setError(err.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div>
        <Navbar />
        <div className="p-6">Loading analytics page...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-400 mb-6">
          View test performance statistics for a selected test.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-900 text-red-200">
            {error}
          </div>
        )}

        <div className="mb-6 p-4 rounded-xl border border-gray-700 bg-[#1a1a1a]">
          <label className="block mb-2 font-medium">Select Test</label>
          <select
            className="w-full p-2 rounded bg-white text-black mb-4"
            value={selectedTestId}
            onChange={(e) => setSelectedTestId(e.target.value)}
          >
            <option value="">-- Select a test --</option>
            {tests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.title} (ID: {test.id})
              </option>
            ))}
          </select>

          <button
            onClick={handleFetchAnalytics}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            {loading ? "Loading..." : "Load Analytics"}
          </button>
        </div>

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-gray-700 bg-[#1a1a1a]">
              <p className="text-gray-400 text-sm">Test Title</p>
              <p className="text-xl font-semibold">{analytics.testTitle}</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-700 bg-[#1a1a1a]">
              <p className="text-gray-400 text-sm">Total Attempts</p>
              <p className="text-xl font-semibold">{analytics.totalAttempts}</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-700 bg-[#1a1a1a]">
              <p className="text-gray-400 text-sm">Completed Attempts</p>
              <p className="text-xl font-semibold">{analytics.completedAttempts}</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-700 bg-[#1a1a1a]">
              <p className="text-gray-400 text-sm">Average Score</p>
              <p className="text-xl font-semibold">{analytics.averageScore}</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-700 bg-[#1a1a1a]">
              <p className="text-gray-400 text-sm">Highest Score</p>
              <p className="text-xl font-semibold">{analytics.highestScore}</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-700 bg-[#1a1a1a]">
              <p className="text-gray-400 text-sm">Lowest Score</p>
              <p className="text-xl font-semibold">{analytics.lowestScore}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAnalyticsPage;