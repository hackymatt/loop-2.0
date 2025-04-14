import axios from "axios";
import https from "https";
import { QueryClient } from "@tanstack/react-query";

import { paths } from "src/routes/paths";

import { CONFIG } from "src/global-config";

import { defaultUser } from "src/components/user/user-config";

import { URLS } from "./urls";

const queryClient = new QueryClient();

export const createAxiosInstance = (endpoint: string) => {
  if (endpoint.startsWith("https")) {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    return axios.create({ baseURL: endpoint, httpsAgent });
  }
  return axios.create({
    baseURL: endpoint,
    withCredentials: true,
  });
};

export const Api = createAxiosInstance(CONFIG.api);

const PlainApi = createAxiosInstance(CONFIG.api);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, tokenRefreshed: boolean) => {
  failedQueue.forEach((prom) => {
    if (tokenRefreshed) {
      prom.resolve();
    } else {
      prom.reject(error);
    }
  });

  failedQueue = [];
};

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => Api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await PlainApi.post(URLS.REFRESH_TOKEN);
        processQueue(null, true);
        return Api(originalRequest);
      } catch (err) {
        processQueue(err, false);
        document.cookie = `user=${JSON.stringify(defaultUser)}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        window.location.href = paths.login;
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
