import axios from "../../../shared/apiClient";

export const getBoard = async (boardId) => {
  try {
    const response = await axios.get(`board/${boardId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching board:", error);
    throw error;
  }
};

export const getAllBoards = async () => {
  try {
    const response = await axios.get("board");
    return response.data;
  } catch (error) {
    console.error("Error fetching all boards:", error);
    throw error;
  }
};
