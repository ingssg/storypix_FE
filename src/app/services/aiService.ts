import { apiClient } from "../lib/apiClient";

export interface Communication {
  storyId: number;
  openaiSessionId: string;
  questionPage: number;
  previousSentence: string;
  currentSentence: string;
  records: Record[];
  createdAt: Date;
}

export type Record = {
  text: string;
  isUser: boolean;
  createdAt: Date;
};

export const getTokenAPI = async (storyId: number) => {
  const { data } = await apiClient.post("/communications/session", {
    storyId,
  });
  return data;
};

export const postCommuicationAPI = async (communication: Communication) => {
  const { data } = await apiClient.post("/communications", communication);
  return data;
};
