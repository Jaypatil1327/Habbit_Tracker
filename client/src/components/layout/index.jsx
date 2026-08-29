import { Outlet, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

function Layout() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen">
      <div className="min-h-16 border-b-2 border-gray-400 flex p-4 justify-between items-center">
        <h1 className="text-xl font-bold" onClick={() => nav("/")}>
          Application_name
        </h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => nav("/create-new-task")}>
            Create new Task
          </Button>
          <Button onClick={() => nav("/scrum-board")}>Scrum Borad</Button>
          <Avatar>
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <main className="flex justify-center items-center">
        <Outlet></Outlet>
      </main>
    </div>
  );
}

export default Layout;
