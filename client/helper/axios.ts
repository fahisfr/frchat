import axios from "axios";

export const baseURL = "http://localhost:4000";

export const profileUrl = `${baseURL}/profiles/`;
export const getProfileUrl = (image: String) => profileUrl + image;

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
    return Promise.reject(error);
  }
);

type Method = "POST" | "GET" | "DELETE" | "PUT";

export default (method: Method, path: string, body?: any): any => {
  return new Promise(async (resolve, reject) => {
    try {
      let response;
      switch (method) {
        case "POST":
          response = await instance.post(path, body);
          break;
        case "GET":
          response = await instance.get(path);
          break;
        case "DELETE":
          response = await instance.delete(path);
          break;
        case "PUT":
          response = instance.put(path);
          break;
        default:
          throw new Error(`Invalid method: ${method}`);
      }

      const { data } = response;

      if (response.status === 200) {
        if (data.status === "ok") {
          resolve(data);
        } else if (data.status === "error") {
          reject(data);
        }
      } else {
        reject({ status: "error", error: response.message });
      }
    } catch (error: any) {
      reject({ status: "error", error: error.message });
    }
  });
};
