import apiClient from "./client";
import { API_ROUTES } from "../constants/appConstants";

export const loginApi = async (payload) => {
  const { data } = await apiClient.post(API_ROUTES.login, payload);
  return data;
};

export const signupApi = async (payload) => {
  const { data } = await apiClient.post(API_ROUTES.signup, payload);
  return data;
};

export const getProfileApi = async () => {
  const { data } = await apiClient.post(API_ROUTES.profile);
  return data;
};

export const updatePasswordApi = async (payload) => {
  const { data } = await apiClient.put(API_ROUTES.updatePassword, payload);
  return data;
};
