import axios from "../../../shared/apiClient";

export const getAnswersByQuestionIdApi = async (questionId) => {
  try {
    const response = await axios.get(`answers/${questionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching answers:", error);
    throw error;
  }
};
