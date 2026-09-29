
import axios from "axios";
import type {
  TaskInput,
  TaskItem
} from "../types/task";

export const api = axios.create({
    baseURL: "https://localhost:7183/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export const taskApi = {
  async getAll(): Promise<TaskItem[]> {
    const response = await api.get<TaskItem[]>(
      "/tasks"
    );

    return response.data;
  },

  async getById(id: number): Promise<TaskItem> {
    const response = await api.get<TaskItem>(
      `/tasks/${id}`
    );

    return response.data;
  },

  async create(data: TaskInput): Promise<TaskItem> {
    const response = await api.post<TaskItem>(
      "/tasks",
      data
    );

    return response.data;
  },

  async update(
    id: number,
    data: TaskInput
  ): Promise<void> {
    await api.put(`/tasks/${id}`, data);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }
};
