import Chart from "@/components/chart";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { getTasks, updateTaskStatus } from "@/services/tasks";
import { isTaskOnDate } from "@/lib/date-utils";
import { useNavigate } from "react-router-dom";
import ScrumBoardWidget from "@/components/scrum_board_widget";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const today = new Date();
  
  // Filter for today's tasks to pass to Chart
  const todayTasks = tasks.filter((task) => isTaskOnDate(task, today));

  // Determine all upcoming dates that have tasks to highlight in the Calendar
  const highlightedDates = [];
  // For simplicity, let's just highlight the next 60 days if a task falls on them
  for (let i = 0; i < 60; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    d.setHours(0, 0, 0, 0);
    if (tasks.some((task) => isTaskOnDate(task, d))) {
      highlightedDates.push(d);
    }
  }

  function handleDayClick(day) {
    // Format the date to YYYY-MM-DD
    const dateStr = day.toLocaleDateString("en-CA");
    navigate(`/tasks/${dateStr}`);
  }

  async function handleStatusChange(taskId, newStatus) {
    try {
      // Optimistically update local state for a snappier UI
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
      // Revert if it fails
      fetchTasks();
    }
  }

  return (
    <div className="w-full p-4 space-y-4 relative">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full min-h-[450px] border rounded-lg p-4">
          {!isLoading && <Chart tasks={todayTasks} />}
        </div>

        <div className="w-full min-h-[450px] border rounded-lg p-4 flex justify-center">
          <Calendar 
            className={"min-h-[400px] min-w-[400px]"} 
            modifiers={{ hasTask: highlightedDates }}
            modifiersClassNames={{ hasTask: "bg-blue-500 text-white font-semibold hover:bg-blue-600 hover:text-white" }}
            onDayClick={handleDayClick}
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-xl shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 p-6 min-h-[160px] text-white flex flex-col justify-center transition-transform hover:scale-[1.02]">
          <h3 className="text-lg font-medium opacity-90">Total Today</h3>
          <p className="text-4xl font-bold mt-2">{todayTasks.length}</p>
        </div>
        <div className="border rounded-xl shadow-sm bg-gradient-to-br from-amber-400 to-orange-500 p-6 min-h-[160px] text-white flex flex-col justify-center transition-transform hover:scale-[1.02]">
          <h3 className="text-lg font-medium opacity-90">In Progress Today</h3>
          <p className="text-4xl font-bold mt-2">{todayTasks.filter(t => t.status === "InProgress").length}</p>
        </div>
        <div className="border rounded-xl shadow-sm bg-gradient-to-br from-emerald-400 to-green-600 p-6 min-h-[160px] text-white flex flex-col justify-center transition-transform hover:scale-[1.02]">
          <h3 className="text-lg font-medium opacity-90">Completed Today</h3>
          <p className="text-4xl font-bold mt-2">{todayTasks.filter(t => t.status === "completed").length}</p>
        </div>
      </div>

      {!isLoading && (
        <ScrumBoardWidget tasks={tasks} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}

export default Home;
