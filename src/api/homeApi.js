import axios from "axios";

// Set a base URL for your backend API
const API = axios.create({
  baseURL: "https://real-state-property-backend.vercel.app/", // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // only if you need cookies/auth
});

// Function to get home message
export const fetchHome = async () => {
  try {
    const response = await API.get("/");
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    console.error("Error fetching home:", error);
    throw error;
  }
};
