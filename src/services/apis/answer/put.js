import axios from "../../../shared/apiClient";

export const updateAnswerApi = async (data) => {
  const { content, questionId } = data;
  console.log(data, "입력 데이터 ");
  const updatedAnswer = {
    content,
    questionId,
  };

  try {
    const response = await axios.put(`answers`, updatedAnswer);
    return response.data;
  } catch (error) {
    console.error("Error fetching answer:", error);
    throw error;
  }
};
