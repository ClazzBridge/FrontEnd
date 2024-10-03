import axiosInstance from "../../../services/axiosInstance";

export const deletePost = async (ids) => {
  try {
    const response = await axiosInstance.delete(`api/post`, { data: ids });
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};
