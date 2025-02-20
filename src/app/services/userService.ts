import { apiClient } from "../lib/apiClient";

// 유저 관련 api 집합

export const fetchUser = async () => {
  try {
    const { data } = await apiClient.get("/users/me");
    localStorage.setItem("nickname", data.userInfo.nickname);
    return data;
  } catch (error) {
    console.error(error);
    localStorage.removeItem("nickname");
    throw new Error("비로그인 유저");
  }
};

export const signout = async () => {
  await apiClient.delete("/auth/signout");
};

export const deleteUser = async () => {
  await apiClient.delete("/auth/leave");
};
