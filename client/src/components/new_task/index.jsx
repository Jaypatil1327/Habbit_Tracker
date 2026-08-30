import { useState } from "react";
import { Card, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { createTask } from "@/services/tasks";
import { transcribeAudio } from "@/services/audio";
import { useNavigate } from "react-router-dom";

function NewTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const navigate = useNavigate();

  const days = [
    { label: "Mon", value: 1 },
    { label: "Tue", value: 2 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 4 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 6 },
    { label: "Sun", value: 0 },
  ];

  function toggleDay(day) {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((prev) => prev !== day);
      } else return [...prev, day];
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title) return;
    setIsLoading(true);
    try {
      await createTask({
        title,
        description,
        frequency,
        selectedDays: frequency === "weekly" ? JSON.stringify(selectedDays) : null,
        selectedDates: frequency === "monthly" ? JSON.stringify(selectedDate) : null,
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsTranscribing(true);
    try {
      const result = await transcribeAudio(file);
      
      if (result.status === "success") {
        setDescription((prev) => prev ? prev + " " + result.data : result.data);
      } else {
        alert("Failed to transcribe audio.");
      }
    } catch (error) {
      console.error("Audio transcription error", error);
      alert("Error transcribing audio. Please try again.");
    } finally {
      setIsTranscribing(false);
      e.target.value = null; // Reset input so the same file can be selected again
    }
  };

  return (
    <div className="w-1/2 mt-12 mx-auto">
      <Card className="p-4 shadow-xl space-y-4">
        <CardTitle>Create New Task</CardTitle>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input 
              placeholder="Enter task title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Description</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="audio-upload" className="text-xs text-blue-500 cursor-pointer hover:underline">
                  {isTranscribing ? "Transcribing..." : "Upload Audio to Transcribe"}
                </Label>
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleAudioUpload}
                  disabled={isTranscribing}
                />
              </div>
            </div>
            <Input 
              placeholder="Enter description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <Label>Frequency</Label>

            <Select
              value={frequency}
              onValueChange={setFrequency}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder="Select frequency"
                />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {frequency === "weekly" && (
            <div className="space-y-2">
              <Label>Select Days</Label>

              <div className="flex gap-2 flex-wrap">
                {days.map((day) => (
                  <Button
                    key={day.value}
                    type="button"
                    variant={
                      selectedDays.includes(day.value) ? "default" : "outline"
                    }
                    className="h-10 w-10 p-2"
                    onClick={() => toggleDay(day.value)}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {frequency === "monthly" && (
            <div className="space-y-2 flex flex-col gap-2 justify-center items-center">
              <Label>Select dates</Label>
              <Calendar
                className="w-1/2"
                mode="multiple"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={{
                  before: new Date(),
                }}
              />
            </div>
          )}

          {/* Temporarily disabled Media upload
          <Label>Media</Label>
          <Input type="file" accept="image/*" disabled />
          */}

          <Button type="submit" className="mt-2" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default NewTask;
