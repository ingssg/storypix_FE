import { apiClient } from "../lib/apiClient";

export const fetchUser = async () => {
  const { data } = await apiClient.get("/users/me");
  return data;
};

export const signout = () => {
  apiClient.delete("/auth/signout");
};

export const deleteUser = () => {
  apiClient.delete("/auth/leave");
};
