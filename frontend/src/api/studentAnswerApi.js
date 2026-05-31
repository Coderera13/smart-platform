import axiosInstance from "../services/axiosInstance";

export const submitAnswer = async (payload) => {
  const response = await axiosInstance.post("/api/attempts/submit-answer", payload);
  return response.data;
};

export const finishAttempt = async (attemptId) => {
  const response = await axiosInstance.post(`/api/attempts/finish/${attemptId}`);
  return response.data;
};