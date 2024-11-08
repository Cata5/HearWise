// utils.js
import axios from "axios";

// Fetch user data
export const fetchUserData = async (token) => {
  try {
    const userResponse = await axios.get("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return userResponse.data;
  } catch (error) {
    throw new Error("Error fetching user data");
  }
};

