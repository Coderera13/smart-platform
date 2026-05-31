import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getQuestions,
  deleteQuestion,
  createQuestion,
  updateQuestion,
} from "../api/questionApi";

function AdminQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    questionText: "",
    topic: "",
    difficulty: "EASY",
    explanation: "",
    options: ["", "", "", ""],
    correctIndex: 0,
  });

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getQuestions();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this question?");
    if (!confirmed) return;

    try {
      await deleteQuestion(id);
      await loadQuestions();
    } catch (err) {
      setError(err.message || "Failed to delete question");
    }
  };

  const handleEdit = (question) => {
    setEditingId(question.id);

    setForm({
      questionText: question.questionText || "",
      topic: question.topic || "",
      difficulty: question.difficulty || "EASY",
      explanation: question.explanation || "",
      options: question.options?.map((o) => o.optionText) || ["", "", "", ""],
      correctIndex: question.options?.findIndex((o) => o.correct) || 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...form.options];
    updatedOptions[index] = value;

    setForm((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const resetForm = () => {
    setForm({
      questionText: "",
      topic: "",
      difficulty: "EASY",
      explanation: "",
      options: ["", "", "", ""],
      correctIndex: 0,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        questionText: form.questionText,
        topic: form.topic,
        difficulty: form.difficulty,
        explanation: form.explanation,
        options: form.options.map((text, index) => ({
          optionText: text,
          correct: index === Number(form.correctIndex),
        })),
      };

      if (editingId) {
        await updateQuestion(editingId, payload);
      } else {
        await createQuestion(payload);
      }

      resetForm();
      await loadQuestions();
    } catch (err) {
      setError(err.message || "Failed to save question");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="p-6">Loading questions...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Question Management</h1>
            <p className="text-gray-400">
              View and manage all questions in the system.
            </p>
          </div>
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
            {editingId ? "Update Question" : "Create Question"}
          </h2>

          <div>
            <label className="block mb-1">Question Text</label>
            <input
              type="text"
              name="questionText"
              value={form.questionText}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Topic</label>
            <input
              type="text"
              name="topic"
              value={form.topic}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
            >
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Explanation</label>
            <textarea
              name="explanation"
              value={form.explanation}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.options.map((option, index) => (
              <div key={index}>
                <label className="block mb-1">Option {index + 1}</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full p-2 rounded bg-white text-black"
                  required
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block mb-1">Correct Option</label>
            <select
              name="correctIndex"
              value={form.correctIndex}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white text-black"
            >
              <option value={0}>Option 1</option>
              <option value={1}>Option 2</option>
              <option value={2}>Option 3</option>
              <option value={3}>Option 4</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              {editingId ? "Update Question" : "Create Question"}
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
                <th className="p-3">Question</th>
                <th className="p-3">Topic</th>
                <th className="p-3">Difficulty</th>
                <th className="p-3">Options</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className="border-t border-gray-700">
                  <td className="p-3">{q.id}</td>
                  <td className="p-3">{q.questionText}</td>
                  <td className="p-3">{q.topic}</td>
                  <td className="p-3">{q.difficulty}</td>
                  <td className="p-3">{q.options?.length || 0}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(q)}
                      className="px-3 py-1 rounded bg-yellow-600 text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(q.id)}
                      className="px-3 py-1 rounded bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {questions.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-gray-400" colSpan="6">
                    No questions found.
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

export default AdminQuestionsPage;