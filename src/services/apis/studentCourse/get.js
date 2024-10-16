import axios from "../../../shared/apiClient";

export const getCourseId = async () => {
  try {
    const response = await axios.get("studentCourses");
    return response.data;
  } catch (error) {
    console.error("Error fetching studentCourses:", error);
    throw error;
  }
};
