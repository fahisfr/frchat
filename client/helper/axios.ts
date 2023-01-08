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
  ({ data }) => {
    if (data.status == "ok") {
      return Promise.resolve(data);
    } else if (data.status === "error") {
      return Promise.reject(data);
    } else {
      return Promise.reject({
        status: "error",
        error: "invalid response data.status",
      });
    }
  },
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
      return Promise.reject({
        status: "error",
        error: "failed to refresh access token",
      });
    }
    return Promise.reject({ status: "error", error: error.message });
  }
);

// type Method = "POST" | "GET" | "DELETE" | "PUT";

// export default (method: Method, path: string, body?: any): any => {
//   return instance({ method, url: path, data: body }).then(
//     ({ data }) => data,
//     (error) => Promise.resolve({ status: "error", error: error.message })
//   );
// };
export default instance;
