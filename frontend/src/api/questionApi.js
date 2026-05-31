import axiosInstance from "../services/axiosInstance";

export const getQuestions = async () => {
  const response = await axiosInstance.get("/api/questions");
  return response.data;
};

export const createQuestion = async (questionData) => {
  const response = await axiosInstance.post("/api/questions", questionData);
  return response.data;
};

export const updateQuestion = async (id, questionData) => {
  const response = await axiosInstance.put(`/api/questions/${id}`, questionData);
  return response.data;
};

export const deleteQuestion = async (id) => {
  await axiosInstance.delete(`/api/questions/${id}`);
};