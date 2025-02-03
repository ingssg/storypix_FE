import { apiClient } from "../lib/apiClient";

export const fetchUser = async () => {
  const { data } = await apiClient.get("/users/me");
  // console.log(data);
  return data;
};

export const signout = async () => {
  const { data } = await apiClient.delete("/auth/signout");
  return data;
};

export const deleteUser = async () => {
  const { data } = await apiClient.delete("/auth/leave");
  return data;
}
