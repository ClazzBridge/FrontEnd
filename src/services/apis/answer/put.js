import apiClient from "../../../shared/apiClient";

export const updateAnswerApi = async (data) => {
  const { content, questionId } = data;
  console.log(data, "입력 데이터 ");
  const updatedAnswer = {
    content,
    questionId,
  };

  try {
    const response = await apiClient.put(`qnas/answers`, updatedAnswer);
    return response.data;
  } catch (error) {
    console.error("Error fetching answer:", error);
    throw error;
  }
};
