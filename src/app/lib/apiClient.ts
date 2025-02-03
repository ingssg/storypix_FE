import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // console.error("401 Unauthorized");
          console.log("로그인 필요");
          break;
        case 403:
          console.log("403 Forbidden");
          break;
        case 404:
          console.log("404 Not Found");
          break;
        case 500:
          console.log("500 Internal Server Error");
          break;
        default:
          console.log("API 요청 오류", error.response.status);
      }
    } else if (error.request) {
      console.log("API 요청 실패");
    } else {
      console.log("요청 생성 전 에러 발생", error.message);
    }
    return Promise.reject(error);
  }
);
