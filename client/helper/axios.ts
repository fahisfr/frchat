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
    const accessToken = localStorage.getItem("access_token");
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
      const { data } = await instance.get("/user/refresh-token");

      if (data.status == "ok") {
        console.log(data);

        localStorage.setItem("access_token", data.accessToken);
        return instance.request(prevRequest);
      }
      localStorage.removeItem("access_token");
      return Promise.reject({
        status: "error",
        error: "failed to refresh access token",
      });
    }
    return Promise.reject({ status: "error", error: error.message });
  }
);

// export default (method: Method, path: string, body?: any): any => {
//   return instance({ method, url: path, data: body }).then(
//     ({ data }) => data,
//     (error) => Promise.resolve({ status: "error", error: error.message })
//   );
// };
export default instance;
