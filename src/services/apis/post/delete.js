import axios from "../../../shared/apiClient";

export const deletePost = async (ids) => {
  try {
    const response = await axios.delete(`post`, { data: ids });
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};
