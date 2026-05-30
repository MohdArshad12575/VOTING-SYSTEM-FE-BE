import apiClient from "./client";
import { API_ROUTES } from "../constants/appConstants";
import { dedupeRequest } from "../utils/dedupe";

export const getCandidatesApi = () =>
  dedupeRequest("candidates", async () => {
    const { data } = await apiClient.get(API_ROUTES.candidates);
    return data;
  });

export const voteApi = async (candidateId) => {
  const { data } = await apiClient.post(`${API_ROUTES.vote}/${candidateId}`);
  return data;
};

export const getVoteCountApi = () =>
  dedupeRequest("vote-count", async () => {
    const { data } = await apiClient.get(API_ROUTES.voteCount);
    return data;
  });
