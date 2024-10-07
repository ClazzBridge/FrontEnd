import axios from "../../../shared/apiClient";

export const saveAnswerApi = async (data) => {
  const { content, memberId, questionId } = data;
  console.log(data, "입력 데이터 ");
  const savedAnswer = {
    content,
    memberId,
    questionId,
  };

  try {
    const response = await axios.post(`answers`, savedAnswer);
    return response.data;
  } catch (error) {
    console.error("Error fetching answer:", error);
    throw error;
  }
};
