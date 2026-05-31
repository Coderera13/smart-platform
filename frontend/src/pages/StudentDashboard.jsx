import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function StudentDashboard() {
  return (
    <div>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/attempt-history"
            className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            View Attempt History
          </Link>

          <Link
            to="/available-tests"
            className="inline-flex px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            View Available Tests
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;