"use client";
import { useState, useRef,useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { fetchUserData } from "../utils/utils";

export default function AudioTranscription() {
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [email, setEmail] = useState(null);

  // Fetch email from /api/profile
  const fetchEmail = async () => {
    try {
      const token = localStorage.getItem('jwt_token');  // Get the JWT token from localStorage
      console.log("Received token:", token);  // Log the token to ensure it's being fetched correctly
      if (!token) {
        alert("Token not found. Please log in.");
        return;
      }
  
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,  // Attach the token to the Authorization header
        },
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data: " + error.message);
        return;
      }
  
      const data = await response.json();
      console.log("User data:", data);  // Log the user data to verify the response
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Error fetching user data.");
    }
  };
  
  
  

  const handleStartRecording = () => {
    setLoading(true);
    audioChunksRef.current = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          await transcribeAudio(audioBlob);
        };

        mediaRecorderRef.current.start();
      })
      .catch((err) => {
        console.error("Error accessing microphone: ", err);
        alert("Error accessing microphone: " + err);
        setLoading(false);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setLoading(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await axios.post("http://localhost:5000/transcribe", formData);
      if (response?.data?.transcription) {
        setTranscription(response.data.transcription);
        await saveTranscription(response.data.transcription);  // Save transcription after getting it
      } else {
        alert("Error: No transcription returned.");
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
      alert("Failed to transcribe audio.");
    } finally {
      setLoading(false);
    }
  };

  const saveTranscription = async (transcriptionText) => {
    if (!email) {
      await fetchUserData();  // Fetch email if not already set
    }

    if (email) {
      try {
        const response = await axios.post("http://localhost:5000/api/transcribe/save", {
          name: "dynamicName",  // You can change this as per your requirement
          transcription: transcriptionText,
          email,  // Send email with transcription
        });

        if (response.data.success) {
          console.log("Transcription saved successfully");
        } else {
          console.error("Error saving transcription:", response.data.message);
        }
      } catch (error) {
        console.error("Error saving transcription:", error);
        alert("Failed to save transcription.");
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("audio", file);
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:5000/transcribe", formData);
        if (response.data.transcription) {
          setTranscription(response.data.transcription);
          await saveTranscription(response.data.transcription);  // Save transcription after getting it
        } else {
          alert("Error: No transcription returned.");
        }
      } catch (error) {
        console.error("Error transcribing audio:", error);
        alert("Failed to transcribe audio.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-[100vh] bg-[url('/bg.png')] bg-cover bg-center font-sans text-gray-800 ">
      <Header Name={'Transcript'} />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full text-center space-y-4">
        {/* Start Recording Button */}
        <button
          onClick={handleStartRecording}
          disabled={loading}
          className=" mt-[18rem] px-6 py-3 bg-blue-500 text-white rounded-md disabled:opacity-50"
        >
          Start Recording
        </button>

        {/* Stop Recording Button */}
        <button
          onClick={handleStopRecording}
          disabled={!loading}
          className="px-6 py-3 bg-red-500 text-white rounded-md disabled:opacity-50"
        >
          Stop Recording
        </button>

        {/* File Upload */}
        <label className="block mt-4">
          <span className="text-gray-700 font-semibold">Upload Pre-recorded Audio</span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
        </label>
      </div>

      {/* Loading Text */}
      {loading && <p className="text-center text-blue-500 font-semibold mt-4">Processing audio...</p>}

      {/* Transcription Display */}
      {transcription && (
        <div className="mt-6 p-6 bg-gray-100 rounded-md shadow-md max-w-md w-full text-center">
          <h3 className="text-xl font-semibold mb-2">Transcription:</h3>
          <p className="whitespace-pre-wrap">{transcription}</p>
        </div>
      )}
    </div>
  );
}
