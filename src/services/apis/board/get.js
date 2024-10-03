import axiosInstance from "../../../services/axiosInstance";

export const getBoard = async (boardId) => {
  try {
    const response = await axiosInstance.get(`api/board/${boardId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching board:", error);
    throw error;
  }
};

export const getAllBoards = async () => {
  try {
    const response = await axiosInstance.get("api/board");
    return response.data;
  } catch (error) {
    console.error("Error fetching all boards:", error);
    throw error;
  }
};
