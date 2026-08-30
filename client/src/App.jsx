import { Route, Routes, Navigate } from "react-router-dom";
import Auth from "./pages/auth/auth";
import Layout from "./components/layout";
import NewTask from "./components/new_task";
import Home from "./pages/home";
import TasksByDate from "./pages/tasks_by_date";
import NotFound from "./pages/notfound";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";

function App() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/auth" element={!isAuthenticated ? <Auth /> : <Navigate to="/" />} />
      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/auth" />}>
        <Route index element={<Home />} />
        <Route path="create-new-task" element={<NewTask />} />
        <Route path="tasks/:date" element={<TasksByDate />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
