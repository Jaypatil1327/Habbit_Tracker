import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTasks, updateTask, deleteTask } from "@/services/tasks";
import { isTaskOnDate } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TasksByDate() {
  const { date } = useParams();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  // We ensure we have a valid date from URL, format: YYYY-MM-DD
  // To avoid timezone issues when parsing "YYYY-MM-DD", appending "T00:00:00" helps
  const targetDate = new Date(`${date}T00:00:00`);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const allTasks = await getTasks();
      const filteredTasks = allTasks.filter((t) => isTaskOnDate(t, targetDate));
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Failed to load tasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [date]);

  function startEdit(task) {
    setEditingTaskId(task.id);
    setEditForm({ title: task.title, description: task.description || "" });
  }

  async function handleUpdate(task) {
    if (!editForm.title.trim()) return;
    setIsUpdating(true);
    try {
      await updateTask(task.id, {
        title: editForm.title,
        description: editForm.description,
        frequency: task.frequency,
        selectedDays: task.selectedDays,
        selectedDates: task.selectedDates
      });
      setEditingTaskId(null);
      await fetchTasks();
    } catch (error) {
      console.error("Failed to update task", error);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete(taskId) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    setIsUpdating(true);
    try {
      await deleteTask(taskId);
      await fetchTasks();
    } catch (error) {
      console.error("Failed to delete task", error);
    } finally {
      setIsUpdating(false);
    }
  }

  const formattedDate = targetDate.toLocaleDateString("en-US", {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="w-full p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="outline" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Tasks for {formattedDate}</h1>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-slate-500 text-center py-8">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center text-slate-500">
            <h2 className="text-xl font-medium mb-2">No tasks found</h2>
            <p>There are no tasks scheduled for this day.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white border p-6 rounded-lg shadow-sm">
              {editingTaskId === task.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Title</label>
                    <Input 
                      value={editForm.title} 
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} 
                      placeholder="Task Title" 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    <Input 
                      value={editForm.description} 
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} 
                      placeholder="Task Description" 
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" onClick={() => setEditingTaskId(null)}>Cancel</Button>
                    <Button onClick={() => handleUpdate(task)} disabled={isUpdating}>
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-xl text-slate-900">{task.title}</h3>
                      {task.description && (
                        <p className="text-slate-600 mt-2">{task.description}</p>
                      )}
                      <div className="mt-4 inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-md capitalize font-medium">
                        {task.status}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(task)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(task.id)} disabled={isUpdating}>Delete</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
