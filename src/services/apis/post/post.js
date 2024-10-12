import axios from "../../../shared/apiClient";

export const savePost = async (testData) => {
  const { title, content, boardId } = testData;
  const savedPost = {
    title,
    content,
    memberId: 11,
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
