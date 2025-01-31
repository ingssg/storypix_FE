import { apiClient } from "../lib/apiClient";

export const fetchUser = async () => {
  const { data } = await apiClient.get("/users/me");
  return data;
};
