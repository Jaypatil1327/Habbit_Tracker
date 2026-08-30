import React from "react";

const statuses = [
  { id: "started", label: "Started" },
  { id: "InProgress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

export default function ScrumBoardWidget({ tasks, onStatusChange }) {
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      onStatusChange(taskId, newStatus);
    }
  };

  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4">Task Board</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statuses.map((status) => (
          <div
            key={status.id}
            className="bg-slate-100/50 border border-slate-200 rounded-xl p-4 min-h-[400px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status.id)}
          >
            <h3 className="font-semibold text-lg text-slate-700 mb-4 pb-2 border-b-2 border-slate-200">
              {status.label}
              <span className="ml-2 text-sm bg-slate-200 px-2 py-0.5 rounded-full">
                {tasks.filter((t) => t.status === status.id).length}
              </span>
            </h3>

            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === status.id)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-move hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-slate-900">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-3 flex justify-between items-center text-xs text-slate-400 font-medium">
                      <span className="capitalize">{task.frequency}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
