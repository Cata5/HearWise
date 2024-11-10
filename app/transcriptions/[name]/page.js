"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";

const TranscriptionPage = () => {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const transcriptionName = pathname.split("/").pop(); // Get transcription name from URL
  const [transcription, setTranscription] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [activeSection, setActiveSection] = useState(null); // For managing sidebar active section

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user profile on page load
  useEffect(() => {
    const fetchData = async () => {
      if (isClient) {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const response = await axios.get("/api/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = response.data;
          setUserEmail(userData.email);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Error fetching user data");
        }
      }
    };

    fetchData();
  }, [isClient]);

  // Fetch transcription data based on user email and transcription name
  useEffect(() => {
    if (userEmail) {
      const fetchTranscriptions = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("No token found");
            return;
          }

          const response = await axios.get("/api/transcribe/load", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              email: userEmail,
            },
          });

          console.log("Transcriptions Response:", response.data); // Add this log to debug

          const transcriptions = response.data.transcriptions || [];
          const filteredTranscription = transcriptions.find(
            (t) => t.name === transcriptionName
          );

          if (filteredTranscription) {
            setTranscription(filteredTranscription);
          } else {
            setError("Transcription not found");
          }
        } catch (err) {
          console.error("Error fetching transcriptions:", err);
          setError("Error fetching transcriptions");
        } finally {
          setLoading(false);
        }
      };

      fetchTranscriptions();
    }
  }, [userEmail, transcriptionName]);

  const handleSummarize = async () => {
    if (!transcription) return;
    setSummarizing(true);
    setError(null);

    try {
      const response = await axios.post("/api/summarize", {
        userMessage: transcription.transcription,
      });

      setSummary(response.data.summary);
    } catch (err) {
      console.error("Error summarizing transcription:", err);
      setError("Error summarizing transcription");
    } finally {
      setSummarizing(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold">Loading transcription...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  // Render no transcription state
  if (!transcription) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-gray-500">No transcription available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[url('/bg.png')] bg-cover bg-center">
      <Header Name={"Transcriptions"} />

      {/* Sidebar Component */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="relative mt-[15rem] w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <div className="absolute top-0 left-0 w-full h-8 bg-[#238EC7] rounded-t-lg shadow-md">
          <h1 className="text-2xl text-[#fff] mb-4 font-bold text-center">
            {transcription.name}
          </h1>
        </div>

        <div className="bg-white border-4 border-gray-300 rounded-lg p-6 mt-7 h-[250px] overflow-y-auto shadow-md">
          <p className="text-gray-600 text-base leading-relaxed font-bold">
            {transcription.transcription}
          </p>
        </div>

        <button
          onClick={handleSummarize}
          className="mt-4 bg-[#0077B6] hover:bg-[#006398] text-white px-4 py-2 rounded-lg shadow-md"
          disabled={summarizing}
        >
          {summarizing ? "Summarizing..." : "Summarize"}
        </button>

        {summary && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg border-2 border-gray-300 shadow-md">
            <h2 className="text-xl font-bold mb-2">Summary:</h2>
            <p className="text-gray-700 text-base leading-relaxed">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptionPage;
