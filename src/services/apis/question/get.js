import axios from "../../../shared/apiClient";

export const getQuestionApi = async (questionId) => {
  try {
    const response = await axios.get(`questions/${questionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};

export const getAllQuestions = async () => {
  try {
    const response = await axios.get("questions");
    return response.data;
  } catch (error) {
    console.error("Error fetching all questions:", error);
    throw error;
  }
};
