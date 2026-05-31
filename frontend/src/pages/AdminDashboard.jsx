import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const cards = [
    {
      title: "Question Management",
      description: "Create, edit, delete, and review questions.",
      path: "/admin/questions",
    },
    {
      title: "Test Management",
      description: "Create tests and map questions to tests.",
      path: "/admin/tests",
    },
    {
      title: "Analytics",
      description: "View test performance and score statistics.",
      path: "/admin/analytics",
    },
    {
      title: "Leaderboard",
      description: "See top student attempts for each test.",
      path: "/admin/leaderboard",
    },
  ];

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-8">
          Manage questions, tests, analytics, and leaderboard data.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.path}
              className="block rounded-2xl border border-gray-700 bg-[#1a1a1a] p-5 shadow hover:border-blue-500 transition"
            >
              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
              <p className="text-sm text-gray-400">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;