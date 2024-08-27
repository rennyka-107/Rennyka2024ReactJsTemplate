import { useUserStore } from "@/pages/authenticate/state";
import axios from "axios";
import queryString from "query-string";
import { unstable_batchedUpdates } from "react-dom";

const axios_client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  paramsSerializer: (params) => queryString.stringify(params),
});

axios_client.defaults.timeout = 3000;

// Add a request interceptor
axios_client.interceptors.request.use(
  function (config) {
    const access_token = unstable_batchedUpdates(() => {
      return useUserStore.getState().access_token;
    });
    
    if (access_token) {
      config.headers.Authorization = "Bearer " + access_token;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios_client.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response?.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axios_client;
