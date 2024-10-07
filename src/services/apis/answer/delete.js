import axios from "../../../shared/apiClient";

export const deleteAnswerApi = async (id) => {
  try {
    const response = await axios.delete(`answers`, { data: id });
    return response.data;
  } catch (error) {
    console.error("Error fetching answer:", error);
    throw error;
  }
};
