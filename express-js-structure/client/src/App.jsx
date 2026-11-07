import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineCheckBox } from "react-icons/md";
import { TbAlertTriangle } from "react-icons/tb";
import AddTaskForm from "./components/AddTaskForm";
import TaskTable from "./components/TaskTable";
import { fetchTasks, createTask, updateTask, deleteTask } from "./api/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch {
      setError("Could not load tasks. Is the backend running on port 3001?");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(title) {
    const newTask = await createTask(title);
    setTasks((prev) => [...prev, newTask]);
  }

  async function handleEdit(id, updates) {
    const updated = await updateTask(id, updates);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleDelete(id) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">

      {/* HEADER */}
      <header className="bg-gradient-to-r from-emerald-900 to-emerald-600 py-8 text-center shadow-md">
        <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
          <MdOutlineCheckBox className="text-5xl text-white" /> Task Manager
        </h1>
        <p className="mt-1 text-emerald-100 text-sm tracking-wide">Built with Express.js + React</p>
      </header>

      {/* MAIN */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Add form */}
        <AddTaskForm onAdd={handleAdd} />

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 text-emerald-700 text-sm shadow-sm">
            <AiOutlineLoading3Quarters className="animate-spin text-emerald-500 text-lg" />
            Loading tasks…
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-600 text-sm shadow-sm">
            <TbAlertTriangle className="text-lg shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={loadTasks}
              className="border border-red-400 text-red-500 hover:bg-red-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <TaskTable
            tasks={tasks}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="text-center py-4 text-gray-400 text-xs border-t border-gray-100">
        Node.js Learning Journey · express-js-structure
      </footer>
    </div>
  );
}
