import { useState } from "react";
import { FiEdit2, FiTrash2, FiSave } from "react-icons/fi";

export default function TaskRow({ task, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!title.trim() || title.trim() === task.title) {
      setEditing(false);
      setTitle(task.title);
      return;
    }
    setLoading(true);
    try {
      await onEdit(task.id, { title: title.trim() });
      setEditing(false);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setTitle(task.title);
      setEditing(false);
    }
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-emerald-50/50 transition">
      {/* TITLE */}
      <td className="px-5 py-3.5 text-sm text-gray-700">
        {editing ? (
          <input
            className="w-full bg-white border border-emerald-400 ring-2 ring-emerald-400/25 rounded-lg text-gray-800 px-3 py-1.5 text-sm outline-none"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span
            className="cursor-pointer"
            onDoubleClick={() => setEditing(true)}
            title="Double-click to edit"
          >
            {task.title}
          </span>
        )}
      </td>

      {/* ACTIONS */}
      <td className="px-5 py-3.5 text-right">
        <div className="flex justify-end gap-2">
          {editing ? (
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <FiSave /> {loading ? "…" : "Save"}
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <FiEdit2 /> Edit
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
