"use client";

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function AudioTranscription() {
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState(''); // State for Sidebar

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isClient) {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await axios.get('/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEmail(response.data.email);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchData();
  }, [isClient]);

  if (!isClient) return null;

  const handleStartRecording = () => {
    setLoading(true);
    audioChunksRef.current = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await transcribeAudio(audioBlob);
        };

        mediaRecorderRef.current.start();
      })
      .catch((err) => {
        console.error('Error accessing microphone:', err);
        alert('Error accessing microphone: ' + err);
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
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await axios.post('http://localhost:5000/transcribe', formData);
      if (response?.data?.transcription) {
        setTranscription(response.data.transcription);
      } else {
        alert('Error: No transcription returned.');
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('Failed to transcribe audio.');
    } finally {
      setLoading(false);
    }
  };

  const saveTranscription = async () => {
    if (!email || !name || !transcription) {
      alert('Please provide all required fields.');
      return;
    }

    const payload = { email, name, transcription };

    try {
      const response = await fetch('/api/transcribe/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) alert('Transcription saved successfully!');
      else alert(data.message || 'Error saving transcription.');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the transcription.');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('audio', file);
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/transcribe', formData);
        if (response.data.transcription) setTranscription(response.data.transcription);
        else alert('Error: No transcription returned.');
      } catch (error) {
        console.error('Error transcribing audio:', error);
        alert('Failed to transcribe audio.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-[100vh] bg-[url('/bg.png')] bg-cover bg-center font-sans text-gray-800">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <Header Name={'Transcript'} />
  
      <div className="flex flex-col items-center justify-center w-full min-h-screen p-6 text-center space-y-2">
        <div className="w-full max-w-md mt-[2rem] sm:mt-[12rem] bg-white p-6 rounded-lg shadow-lg  ml-16 sm:ml-16 md:ml-16 lg:ml-17 xl:ml-19 space-y-4">
          {/* Name Input */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name for the transcription"
            className="w-full px-4 py-2 border bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
  
          {/* Start Recording Button */}
          <button
            onClick={handleStartRecording}
            disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-lg bg-[#0077B6] hover:bg-[#006398] focus:ring-4 focus:ring-blue-200 transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Start Recording
          </button>
  
          {/* Stop Recording Button */}
          <button
            onClick={handleStopRecording}
            disabled={!loading}
            className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 disabled:opacity-50"
          >
            Stop Recording
          </button>
  
          {/* File Upload */}
          <label className="block text-left">
            <span className="text-gray-700 font-semibold">Upload Pre-recorded Audio</span>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="mt-2 block w-full text-sm shadow-lg rounded-md bg-gray-200 hover:bg-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0077B6] file:hover:bg-[#006398] file:text-white "
            />
          </label>
  
          {/* Save Button */}
          {transcription && (
            <button
              onClick={() => saveTranscription(transcription)}
              className="w-full py-3 mt-4 bg-green-500 shadow-lg text-white font-semibold rounded-md hover:bg-green-600"
            >
              Save Transcription
            </button>
          )}
  
          {/* Loading Text */}
          {loading && (
            <p className="text-center text-gray-500 font-semibold mt-4 animate-pulse">
              Processing audio...
            </p>
          )}
        </div>
  
        {/* Transcription Display */}
        {transcription && (
          <div className="mt-8 p-6 bg-gray-200 rounded-lg shadow-lg max-w-lg mx-auto text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Transcription:</h3>
            <p className="whitespace-pre-wrap text-gray-700">{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
}
