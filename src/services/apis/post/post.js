import axios from "../../../shared/apiClient";

export const savePost = async (data) => {
  const { title, content, boardId: boardTypeId } = data;
  const savedPost = {
    title,
    content,
    boardTypeId,
  };

  console.log(savePost);

  try {
    const response = await axios.post(`posts`, savedPost);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};
