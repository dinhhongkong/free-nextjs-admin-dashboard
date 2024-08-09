import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class ApiClient {
  public api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8080",
      // withCredentials: true, // Để gửi cookies với mỗi request
    });

    // Thêm interceptor request
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Interceptor response (giữ nguyên như cũ)
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401) {
          // Xử lý trường hợp token hết hạn
          // Ví dụ: chuyển hướng đến trang đăng nhập
          window.location.href = "/auth/signin";
        }
        return Promise.reject(error);
      },
    );
  }

  // Phương thức để set token sau khi đăng nhập thành công
  public setToken(token: string) {
    localStorage.setItem("authToken", token);
  }

  // Phương thức để xóa token khi đăng xuất
  public clearToken() {
    localStorage.removeItem("authToken");
  }

  public async get<T>(url: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, { params });
    return response.data;
  }

  public async post<T>(url: string, data: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data);
    return response.data;
  }

  public async put<T>(url: string, data: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data);
    return response.data;
  }

  public async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url);
    return response.data;
  }
}

const apiClient = new ApiClient();
export default apiClient;
