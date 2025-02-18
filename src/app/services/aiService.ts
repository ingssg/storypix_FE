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
  try {
    const { data } = await apiClient.post("/communications/session", {
      storyId,
    });
    return data;
  }
  catch( error ) {
    console.error(error);
    return null;
  }
};

export const postCommuicationAPI = async (communication: Communication) => {
  const { data } = await apiClient.post("/communications", communication);
  return data;
};

export const decreaseCommuiationCountAPI = async (storyId: number) => {
  const { data } = await apiClient.patch("/communications/count", { storyId });
  return data;
};
