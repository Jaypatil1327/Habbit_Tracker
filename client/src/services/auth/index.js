import { axiosInstance } from "@/api";

export async function register(params) {
  try {
    const { data } = await axiosInstance.post("/api/auth/register", params);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function login(params) {
  try {
    const { data } = await axiosInstance.post("/api/auth/login", params);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function checkAuth() {
  try {
    const { data } = await axiosInstance.get("/api/auth/check-auth");
    return data;
  } catch (error) {
    throw error;
  }
}

export async function uploadProfilePicture(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axiosInstance.post("/api/auth/profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}
