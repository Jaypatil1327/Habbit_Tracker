import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/auth";
import Layout from "./components/layout";
import NewTask from "./components/new_task";
import ScrumBoard from "./pages/scrum_board";
import Chart from "./components/chart";
import Home from "./pages/home";
import NotFound from "./pages/notfound";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth></Auth>} />
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/create-new-task" element={<NewTask />}></Route>
        <Route path="/scrum-board" element={<ScrumBoard />}></Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
}

export default App;
