import Chart from "@/components/chart";
import { Calendar } from "@/components/ui/calendar";

function Home() {
  return (
    <div className="w-full p-4 space-y-4">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full min-h-[450px] border rounded-lg p-4">
          <Chart />
        </div>

        <div className="w-full min-h-[450px] border rounded-lg p-4 flex justify-center">
          <Calendar className={"min-h-[400px] min-w-[400px]"} />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 min-h-[200px]" />
        <div className="border rounded-lg p-4 min-h-[200px]" />
        <div className="border rounded-lg p-4 min-h-[200px]" />
      </div>
    </div>
  );
}

export default Home;
