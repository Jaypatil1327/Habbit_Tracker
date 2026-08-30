import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";

function Chart({ tasks = [] }) {
  const startedCount = tasks.filter((t) => t.status === "started").length;
  const inProgressCount = tasks.filter((t) => t.status === "InProgress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const data = [
    {
      status: "Started",
      count: startedCount,
      fill: "#3b82f6",
    },
    {
      status: "In Progress",
      count: inProgressCount,
      fill: "#f59e0b",
    },
    {
      status: "Completed",
      count: completedCount,
      fill: "#22c55e",
    },
  ];

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full h-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="45%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={4}
              label={({ status, percent }) =>
                `${status} ${(percent * 100).toFixed(0)}%`
              }
            />

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Chart;
