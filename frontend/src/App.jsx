import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AttemptHistoryPage from "./pages/AttemptHistoryPage";
import ResultPage from "./pages/ResultPage";
import AdminQuestionsPage from "./pages/AdminQuestionsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminTestsPage from "./pages/AdminTestsPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import StudentTestsPage from "./pages/StudentTestsPage";
import TakeTestPage from "./pages/TakeTestPage";
import AdminLeaderboardPage from "./pages/AdminLeaderboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attempt-history"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <AttemptHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/result/:attemptId"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <ResultPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/questions"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminQuestionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/tests"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminTestsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminAnalyticsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/available-tests"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentTestsPage />
            </ProtectedRoute>
        }
        />

        <Route
          path="/take-test/:attemptId"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <TakeTestPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/leaderboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLeaderboardPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;