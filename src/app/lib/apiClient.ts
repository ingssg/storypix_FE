import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("401 Unauthorized");
          break;
        case 403:
          console.error("403 Forbidden");
          break;
        case 404:
          console.error("404 Not Found");
          break;
        case 500:
          console.error("500 Internal Server Error");
          break;
        default:
          console.error("API 요청 오류", error.response.status);
      }
    } else if (error.request) {
      console.error("API 요청 실패");
    } else {
      console.error("요청 생성 전 에러 발생", error.message);
    }
    return Promise.reject(error);
  }
);
