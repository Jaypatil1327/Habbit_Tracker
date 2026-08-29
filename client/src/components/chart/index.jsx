import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";

function Chart() {
  const data = [
    {
      status: "Started",
      count: 12,
      fill: "#3b82f6",
    },
    {
      status: "In Progress",
      count: 8,
      fill: "#f59e0b",
    },
    {
      status: "Completed",
      count: 2,
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
