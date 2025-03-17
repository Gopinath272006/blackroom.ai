import axios from "axios";

const API_URL = "http://10.0.2.2:8000/chat";  // Change this if deployed

export const chatWithAI = async (prompt) => {
  try {
    const response = await axios.post(API_URL, { prompt });
    return response.data.response;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return "Error connecting to AI";
  }
};
export async function generateImage(imageUri) {
    // Upload the image and get AI-generated response (Replace with your backend API)
    return "http://10.0.2.2:8000/generate-image";
  }
