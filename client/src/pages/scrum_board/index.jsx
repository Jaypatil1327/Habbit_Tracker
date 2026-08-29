import { Card, CardTitle } from "@/components/ui/card";
import { useState } from "react";

function ScrumBoard() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "lect1",
      status: "started",
    },
    {
      id: 2,
      title: "lect2",
      status: "started",
    },
    {
      id: 3,
      title: "lect3",
      status: "started",
    },
    {
      id: 4,
      title: "lect4",
      status: "InProgress",
    },
    {
      id: 5,
      title: "lect5",
      status: "InProgress",
    },
  ]);

  const [draggedItem, setDraggedItem] = useState(null);

  function handleDrop(newStatus) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggedItem ? { ...task, status: newStatus } : task,
      ),
    );

    setDraggedItem(null);
  }

  function getTasks(status) {
    return tasks.filter((task) => task.status === status);
  }

  return (
    <div className="w-full px-4 py-2 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Scrum Board</h1>

      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        <div
          className="border rounded-md h-full"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop("started")}
        >
          <div className="p-4 font-semibold">Started</div>

          <div className="p-4 space-y-2">
            {getTasks("started").map((task) => (
              <Card
                draggable
                key={task.id}
                onDragStart={() => setDraggedItem(task.id)}
                className="cursor-grab p-4"
              >
                <CardTitle>{task.title}</CardTitle>
              </Card>
            ))}
          </div>
        </div>

        <div
          className="border rounded-md h-full"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop("InProgress")}
        >
          <div className="p-4 font-semibold">In Progress</div>

          <div className="p-4 space-y-2">
            {getTasks("InProgress").map((task) => (
              <Card
                draggable
                key={task.id}
                onDragStart={() => setDraggedItem(task.id)}
                className="cursor-grab p-4"
              >
                <CardTitle>{task.title}</CardTitle>
              </Card>
            ))}
          </div>
        </div>

        <div
          className="border rounded-md h-full"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop("completed")}
        >
          <div className="p-4 font-semibold">Completed</div>

          <div className="p-4 space-y-2">
            {getTasks("completed").map((task) => (
              <Card
                draggable
                key={task.id}
                onDragStart={() => setDraggedItem(task.id)}
                className="cursor-grab p-4"
              >
                <CardTitle>{task.title}</CardTitle>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScrumBoard;
