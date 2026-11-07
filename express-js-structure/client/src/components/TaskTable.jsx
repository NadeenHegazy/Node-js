import TaskRow from "./TaskRow";
import { LuClipboardList } from "react-icons/lu";

export default function TaskTable({ tasks, onDelete, onEdit }) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 bg-white border border-emerald-100 rounded-xl text-gray-400 shadow-sm">
        <LuClipboardList className="text-5xl text-emerald-300" />
        <p className="text-sm">No tasks yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full border-collapse">
        <thead className="bg-emerald-50 border-b border-emerald-100">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-emerald-600">
              Task
            </th>
            <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-widest text-emerald-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
