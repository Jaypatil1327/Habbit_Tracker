import { axiosInstance } from "@/api";

export async function getTasks() {
  try {
    const { data } = await axiosInstance.get("/api/tasks");
    return data;
  } catch (error) {
    throw error;
  }
}

export async function createTask(params) {
  try {
    const { data } = await axiosInstance.post("/api/tasks", params);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateTaskStatus(id, status) {
  try {
    const { data } = await axiosInstance.put(`/api/tasks/${id}/status`, { status });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateTask(id, params) {
  try {
    const { data } = await axiosInstance.put(`/api/tasks/${id}`, params);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteTask(id) {
  try {
    const { data } = await axiosInstance.delete(`/api/tasks/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
}
