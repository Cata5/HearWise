"use client";
import { useEffect, useState } from "react";
import HearWiseNavBar from "./components/HearWiseNavBar";
import { fetchUserData } from "./utils/utils";

export default function HearWisePage() {
  const [userName, setUserName] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const userData = await fetchUserData(token);
        setUserName(userData.name);
      } catch (error) {
        console.error("Error fetching user data:", error);  // Log full error details
        setError(error?.message || "An unknown error occurred");  // Use optional chaining
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <HearWiseNavBar userName={userName} />
      <main className="container mx-auto px-4 pt-24 pb-20">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}
        <div className="space-y-6">
          {userName ? (
            <p>Welcome, {userName}!</p>
          ) : (
            <p>Please log in to access your information.</p>
          )}
        </div>
      </main>
    </div>
  );
}
