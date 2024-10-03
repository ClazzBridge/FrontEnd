import axiosInstance from "../../../services/axiosInstance";

export const getPost = async (postId) => {
  try {
    const response = await axiosInstance.get(`api/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    const response = await axiosInstance.get("api/post");
    return response.data;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw error;
  }
};
