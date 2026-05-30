import apiClient from "./client";
import { API_ROUTES } from "../constants/appConstants";
import { clearDedupe } from "../utils/dedupe";

function invalidateCandidates() {
  clearDedupe("candidates");
  clearDedupe("vote-count");
}

export const createCandidateApi = async (payload) => {
  const { data } = await apiClient.post(API_ROUTES.adminCreate, payload);
  invalidateCandidates();
  return data;
};

export const updateCandidateApi = async (candidateId, payload) => {
  const { data } = await apiClient.put(`${API_ROUTES.adminUpdate}/${candidateId}`, payload);
  invalidateCandidates();
  return data;
};

export const deleteCandidateApi = async (candidateId) => {
  const { data } = await apiClient.delete(`${API_ROUTES.adminDelete}/${candidateId}`);
  invalidateCandidates();
  return data;
};
