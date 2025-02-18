import { apiClient } from "../lib/apiClient";

export const fetchUser = async () => {
  try {
    const { data } = await apiClient.get("/users/me");
    localStorage.setItem("nickname", data.userInfo.nickname);
    return data;
  } catch (error) {
    console.log("비로그인 유저", error);
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
