import { apiClient } from "../lib/apiClient";

// 동화 관련 api 집합

export const fetchTales = async (page: number, pageCount: number) => {
  const { data } = await apiClient.get("/stories", {
    params: {
      page,
      pageCount,
    },
  });
  return data;
};

export const fetchTaleById = async (
  id: number,
  pageCount: number,
  page: number
) => {
  const { data } = await apiClient.get(`/stories/${id}/play`, {
    params: {
      pageCount,
      page,
    },
  });
  return data;
};
