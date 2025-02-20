import axios from "axios";

// 기본 apiClient
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 리프레쉬 api는 401로 가도 리프레쉬 하면 안되니까 인터셉터 거치지 않도록 따로 구현
export const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

type RefreshCallback = () => void;

let isRefreshing = false;
let refreshSubscribers: RefreshCallback[] = [];

const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  try {
    await refreshClient.post("/auth/refresh");
    onRefreshed();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 인터셉터를 통한 전역 에러 핸들링
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

  async (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          const originalRequest = error.config;
          if (!originalRequest._retry) {
            if (isRefreshing) {
              return new Promise((resolve) => {
                refreshSubscribers.push(() =>
                  resolve(apiClient(originalRequest))
                );
              });
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try {
              await refreshAccessToken();
              return apiClient(originalRequest);
            } catch (refreshError) {
              console.error(refreshError);
            } finally {
              isRefreshing = false;
            }
          }
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
