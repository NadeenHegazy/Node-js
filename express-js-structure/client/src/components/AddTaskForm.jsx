import { useState } from "react";

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    try {
      await onAdd(title.trim());
      setTitle("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-emerald-200 rounded-xl p-4 shadow-sm">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter a new task…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition whitespace-nowrap cursor-pointer"
        >
          {loading ? "Adding…" : "+ Add Task"}
        </button>
      </div>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </form>
  );
}
