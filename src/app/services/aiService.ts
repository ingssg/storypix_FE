export const getTokenAPI = async (storyId: number) => {
  const { data } = await apiClient.post("/communications/session", {
    storyId,
  });
  return data;
};
