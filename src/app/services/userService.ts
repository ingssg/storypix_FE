import { apiClient } from "../lib/apiClient";

export const fetchUser = async () => {
  const { data } = await apiClient.get("/users/me");
  return data;
};

export const signout = async () => {
  await apiClient.delete("/auth/signout");
};

export const deleteUser = async () => {
  await apiClient.delete("/auth/leave");
};
