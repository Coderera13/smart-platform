import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getTests } from "../api/testApi";
import { fetchLeaderboard } from "../api/leaderboardApi";

function AdminLeaderboardPage() {
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
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

  const handleLoadLeaderboard = async () => {
    if (!selectedTestId) {
      setError("Please select a test first");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await fetchLeaderboard(selectedTestId);
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div>
        <Navbar />
        <div className="p-6">Loading leaderboard page...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-gray-400 mb-6">
          View ranked student scores for a selected test.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-900 text-red-200">
            {error}
          </div>
        )}

        <div className="mb-6 p-4 rounded-xl border border-gray-700 bg-[#1a1a1a]">
          <label className="block mb-2 font-medium">Select Test</label>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="flex-1 p-2 rounded bg-white text-black"
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
              onClick={handleLoadLeaderboard}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              {loading ? "Loading..." : "Load Leaderboard"}
            </button>
          </div>
        </div>

        {leaderboard.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-700">
            <table className="w-full text-left">
              <thead className="bg-gray-900">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Attempt ID</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr key={entry.attemptId} className="border-t border-gray-700">
                    <td className="p-3">{entry.rank}</td>
                    <td className="p-3">{entry.studentName}</td>
                    <td className="p-3">{entry.score}</td>
                    <td className="p-3">{entry.attemptId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading &&
          selectedTestId && (
            <div className="p-4 rounded-xl border border-gray-700 bg-[#1a1a1a]">
              No leaderboard data found for this test.
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default AdminLeaderboardPage;