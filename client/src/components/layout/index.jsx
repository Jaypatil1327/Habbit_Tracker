import { Outlet, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";
import { uploadProfilePicture } from "@/services/auth";
import { Moon, Sun } from "lucide-react";

function Layout() {
  const nav = useNavigate();
  const { user, setUser, handleLogout } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await uploadProfilePicture(file);
        setUser({ ...user, profilePictureUrl: response.profilePictureUrl });
      } catch (error) {
        console.error("Failed to upload profile picture", error);
        alert("Failed to upload profile picture");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="min-h-16 border-b-2 border-gray-400 flex p-4 justify-between items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => nav("/")}>
          Application_name
        </h1>
        <div className="flex gap-4 items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <Button variant="outline" onClick={() => nav("/create-new-task")}>
            Create new Task
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <Avatar className="cursor-pointer" onClick={handleAvatarClick} title="Upload Profile Picture">
            <AvatarImage src={user?.profilePictureUrl} />
            <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      <main className="flex justify-center items-center">
        <Outlet></Outlet>
      </main>
    </div>
  );
}

export default Layout;
