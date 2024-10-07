import axios from "../../../shared/apiClient";

export const saveQuestionApi = async (data) => {
  const { content, memberId } = data;
  console.log(data, "입력 데이터 ");
  const savedQuestion = {
    content,
    memberId,
  };

  try {
    const response = await axios.post(`questions`, savedQuestion);
    return response.data;
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};
