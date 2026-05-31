import axiosInstance from "../services/axiosInstance";

export const fetchLeaderboard = async (testId) => {
  const response = await axiosInstance.get(`/api/tests/${testId}/leaderboard`);
  return response.data;
};