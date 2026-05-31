import axiosInstance from "../services/axiosInstance";

export const getTests = async () => {
  const response = await axiosInstance.get("/api/tests");
  return response.data;
};

export const createTest = async (testData) => {
  const response = await axiosInstance.post("/api/tests", testData);
  return response.data;
};

export const updateTest = async (id, testData) => {
  const response = await axiosInstance.put(`/api/tests/${id}`, testData);
  return response.data;
};

export const deleteTest = async (id) => {
  await axiosInstance.delete(`/api/tests/${id}`);
};

export const startTest = async (testId) => {
  const response = await axiosInstance.post(`/api/attempts/start/${testId}`);
  return response.data;
};