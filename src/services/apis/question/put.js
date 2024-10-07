import axios from "../../../shared/apiClient";

export const updateQuestionApi = async (data) => {
  const { content, id } = data;
  console.log(data, "입력 데이터 ");
  const updatedQuestion = {
    content,
    id,
  };

  try {
    const response = await axios.put(`questions`, updatedQuestion);
    return response.data;
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};