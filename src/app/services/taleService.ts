import { apiClient } from "../lib/apiClient";

export const fetchTales = async (page: number, pageCount: number) => {
  const { data } = await apiClient.get("/stories", {
    params: {
      page,
      pageCount,
    },
  });
  return data;
};
