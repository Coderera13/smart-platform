import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getTests,
  createTest,
  updateTest,
  deleteTest,
} from "../api/testApi";

function AdminTestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    durationMinutes: "",
    totalMarks: "",
    questionIdsInput: "",
  });

  const loadTests = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getTests();
      setTests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      durationMinutes: "",
      totalMarks: "",
      questionIdsInput: "",
    });
    setEditingId(null);
  };

  const handleEdit = (test) => {
    setEditingId(test.id);

    setForm({
      title: test.title || "",
      description: test.description || "",
      durationMinutes: test.durationMinutes?.toString() || "",
      totalMarks: test.totalMarks?.toString() || "",
      questionIdsInput: test.questionIds?.join(", ") || "",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this test?");
    if (!confirmed) return;

    try {
      await deleteTest(id);
      await loadTests();
    } catch (err) {
      setError(err.message || "Failed to delete test");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const parseQuestionIds = (input) => {
    if (!input.trim()) return [];
    return input
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !Number.isNaN(id) && id > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        durationMinutes: Number(form.durationMinutes),
        totalMarks: Number(form.totalMarks),
        questionIds: parseQuestionIds(form.questionIdsInput),
      };

      if (editingId) {
        await updateTest(editingId, payload);
      } else {
        await createTest(payload);
      }

      resetForm();
      await loadTests();
    } catch (err) {
      setError(err.message || "Failed to save test");
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Test Management</h1>
          <p className="text-gray-400">
            Create, update, and manage tests with question mapping.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-900 text-red-200">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mb-8 p-5 rounded-xl border border-gray-700 bg-[#1a1a1a] space-y-4"
        >
          <h2 className="text-2xl font-semibold">
            {editingId ? "Update Test" : "Create Test"}
          </h2>

          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Duration (minutes)</label>
              <input
                type="number"
                name="durationMinutes"
                value={form.durationMinutes}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white text-black"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block mb-1">Total Marks</label>
              <input
                type="number"
                name="totalMarks"
                value={form.totalMarks}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white text-black"
                required
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">
              Question IDs (comma separated)
            </label>
            <input
              type="text"
              name="questionIdsInput"
              value={form.questionIdsInput}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
              placeholder="1, 2, 3"
            />
            <p className="text-sm text-gray-400 mt-1">
              Example: 1, 2, 3
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              {editingId ? "Update Test" : "Create Test"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded bg-gray-600 text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto rounded-xl border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-900">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Description</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Marks</th>
                <th className="p-3">Questions</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id} className="border-t border-gray-700">
                  <td className="p-3">{test.id}</td>
                  <td className="p-3">{test.title}</td>
                  <td className="p-3">{test.description}</td>
                  <td className="p-3">{test.durationMinutes}</td>
                  <td className="p-3">{test.totalMarks}</td>
                  <td className="p-3">{test.questionIds?.length || 0}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(test)}
                      className="px-3 py-1 rounded bg-yellow-600 text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(test.id)}
                      className="px-3 py-1 rounded bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {tests.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-gray-400" colSpan="7">
                    No tests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminTestsPage;