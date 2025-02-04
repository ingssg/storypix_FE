import { apiClient } from "../lib/apiClient";

export const subscribeAPI = async () => {
  const { data } = await apiClient.get("/payment");
  return data;
};
