"use client";
import { useState, useRef } from "react";
import axios from "axios";

export default function AudioTranscription() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecording = () => {
    setLoading(true);
    audioChunksRef.current = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          setAudioFile(audioBlob);
          setLoading(false);
        };
        mediaRecorderRef.current.start();
      })
      .catch((err) => {
        alert("Error accessing microphone: " + err);
        setLoading(false);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    }
  };

  const handleTranscribe = async () => {
    if (!audioFile) {
      alert("Please record or upload an audio file first.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await axios.post("http://localhost:5000/transcribe", formData);
      if (response && response.data && response.data.transcription) {
        setTranscription(response.data.transcription);
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

  return (
    <div className="p-6 max-w-xl mx-auto font-sans text-gray-800">
      <h1 className="text-center text-3xl font-bold text-gray-700 mb-6">Audio Transcription with Whisper</h1>

      <div className="mb-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Record Audio</h2>
        <button
          onClick={handleStartRecording}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 disabled:opacity-50"
        >
           Start Recording
        </button>
        <button
          onClick={handleStopRecording}
          disabled={!loading}
          className="px-4 py-2 bg-red-500 text-white rounded-md disabled:opacity-50"
        >
          ⏹ Stop Recording
        </button>
      </div>

      <div className="mb-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Upload Audio File</h2>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          disabled={loading}
          className="file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-gray-200 file:rounded-md"
        />
      </div>

      <div className="text-center mb-6">
        <button
          onClick={handleTranscribe}
          disabled={loading || !audioFile}
          className="px-6 py-3 bg-green-500 text-white text-lg rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Transcribing..." : "Transcribe Audio"}
        </button>
      </div>

      {transcription && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2">Transcription:</h3>
          <p className="whitespace-pre-wrap">{transcription}</p>
        </div>
      )}
    </div>
  );
}
