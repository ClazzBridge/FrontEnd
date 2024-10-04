import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // 기본 URL 설정
  timeout: 5000, // 요청 타임아웃 설정
  headers: {
    "Content-Type": "application/json",
    // 'Authorization': 'Bearer your-token'
  },
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    // 요청을 보내기 전에 작업 수행
    console.log("Request sent:", config);
    return config;
  },
  (error) => {
    // 요청 오류 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 데이터를 가공
    console.log("Response received:", response);
    return response;
  },
  (error) => {
    // 응답 오류 처리
    return Promise.reject(error);
  }
);

export default axiosInstance;
