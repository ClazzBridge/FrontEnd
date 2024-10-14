import axios from "../../../shared/apiClient";

export const getPost = async (postId) => {
  try {
    const response = await axios.get(`post/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    const response = await axios.get("posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw error;
  }
};
