export function isTaskOnDate(task, date) {
  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  if (task.frequency === "daily") {
    return true;
  }

  if (task.frequency === "weekly" && task.selectedDays) {
    const days = JSON.parse(task.selectedDays);
    return days.includes(taskDate.getDay());
  }

  if (task.frequency === "monthly" && task.selectedDates) {
    const dates = JSON.parse(task.selectedDates).map((d) => {
      const dt = new Date(d);
      dt.setHours(0, 0, 0, 0);
      return dt.getTime();
    });
    return dates.includes(taskDate.getTime());
  }

  return false;
}
