import axiosInstance from "../services/axiosInstance";

export const fetchTestAnalytics = async (testId) => {
  const response = await axiosInstance.get(`/api/admin/tests/${testId}/analytics`);
  return response.data;
};