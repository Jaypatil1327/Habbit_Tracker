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

function NewTask() {
  const [frequency, setFrequency] = useState("daily");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState([]);

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

  console.log(selectedDate);

  return (
    <div className="w-1/2 mt-12">
      <Card className="p-4 shadow-xl space-y-4">
        <CardTitle>Create New Task</CardTitle>

        <form className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="Enter task title" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input placeholder="Enter description" />
          </div>

          <div className="space-y-2">
            <Label>Frequency</Label>

            <Select
              value={frequency}
              onValueChange={setFrequency}
              className={"px-2 py-1"}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder="Select frequency"
                  className={"px-2 py-1"}
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

              <div className="flex gap-2">
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
                className={"w-1/2"}
                mode="multiple"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={{
                  before: new Date(),
                }}
              />
            </div>
          )}

          <Label>Media</Label>
          <Input type={"file"} accept="image/*"></Input>

          <Button type="submit" className="mt-2">
            Create Task
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default NewTask;
