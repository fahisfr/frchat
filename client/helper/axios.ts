import axios from "axios";

export const baseURL = "http://localhost:4000";

export const profileUrl = `${baseURL}/profiles/`;

const instance = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config: any) => {
    const accessToken = localStorage.getItem("auth_token");
    if (accessToken) {
      config.headers["x-access-token"] = `${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (error.response.status === 403 && !prevRequest.sent) {
      prevRequest.sent = true;
      const { data } = await instance.get("/auth/refresh", {
        withCredentials: true,
      });
      if (data.status == "ok") {
        localStorage.setItem("auth_token", data.token);
        return instance.request(prevRequest);
      }

      localStorage.removeItem("auth_token");

      return Promise.reject(error);
    }
  }
);

export default instance;
