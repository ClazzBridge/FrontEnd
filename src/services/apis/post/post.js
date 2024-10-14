import axios from "../../../shared/apiClient";

export const savePost = async (testData) => {
  const { title, content, boardId } = testData;
  console.log(testData, "입력 데이터 ");
  const savedPost = {
    title,
    content,
    memberId: 13,
    boardId,
    classroomId: 2,
  };

  try {
    const response = await axios.post(`posts`, savedPost);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};
