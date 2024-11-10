"use client";
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import SideBar from '../components/SideBar';

export default function AudioTranscription() {
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null); // Add state for email
  const [name, setName] = useState(''); // State for transcription name
  const [isClient, setIsClient] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    setIsClient(true); // Set the state to true after component mounts (client side)
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isClient) {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token); // Log token to see if it's being retrieved properly
        if (!token) return;

        try {
          // Fetch user profile, including email
          const response = await axios.get('/api/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('Fetched user profile:', response.data); // Log user data
          setEmail(response.data.email); // Set email to state
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchData();
  }, [isClient]); // Fetch data after `isClient` is set to true to ensure it's only done client-side

  if (!isClient) {
    return null; // Prevent rendering before component is mounted on the client side
  }

  const handleStartRecording = () => {
    console.log('Starting recording...');
    setLoading(true);
    audioChunksRef.current = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await transcribeAudio(audioBlob);
        };

        mediaRecorderRef.current.start();
      })
      .catch((err) => {
        console.error('Error accessing microphone: ', err);
        alert('Error accessing microphone: ' + err);
        setLoading(false);
      });
  };

  const handleStopRecording = () => {
    console.log('Stopping recording...');
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setLoading(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    console.log('Transcribing audio...');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await axios.post('http://localhost:5000/transcribe', formData);
      console.log('Transcription response:', response); // Log transcription response
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

  const saveTranscription = async (transcription) => {
    if (!email || !name || !transcription) {
      alert('Please provide all required fields.');
      return;
    }
  
    const payload = {
      email: email,
      name: name,
      transcription: transcription,
    };
  
    console.log('Sending to API:', payload);
  
    try {
      const response = await fetch('/api/transcribe/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log('API Response:', data); // Log the full response from the server
  
      if (response.ok) {
        alert('Transcription saved successfully!');
        console.log(data);
      } else {
        alert(data.message || 'Error saving transcription.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the transcription.');
    }
  };
  

  const handleFileUpload = async (event) => {
    console.log('Uploading file...');
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('audio', file);
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/transcribe', formData);
        console.log('File transcription response:', response); // Log file transcription response
        if (response.data.transcription) {
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
    }
  };

  return (
    <div className="h-[100vh] bg-[url('/bg.png')] bg-cover bg-center font-sans text-gray-800">
      <Header Name={'Transcript'} />

      {/* Main Content */}
      
      <div className="flex flex-col items-center justify-center w-full text-center space-y-4">
        {/* Name input field */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name for the transcription"
          className="mt-[17rem] px-4 py-2 border rounded-md"
        />

        {/* Start Recording Button */}
        <button
          onClick={handleStartRecording}
          disabled={loading}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transform transition-transform duration-200 hover:scale-105 disabled:opacity-50"
        >
          Start Recording
        </button>

        {/* Stop Recording Button */}
        <button
          onClick={handleStopRecording}
          disabled={!loading}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transform transition-transform duration-200 hover:scale-105 disabled:opacity-50"
        >
          Stop Recording
        </button>

        {/* File Upload */}
        <label className="block mt-4">
          <span className="text-gray-100 font-semibold">Upload Pre-recorded Audio</span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
        </label>

        {/* Save Button */}
        {transcription && (
          <button
            onClick={() => saveTranscription(transcription)}
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-md"
          >
            Save Transcription
          </button>
        )}
      </div>

      {/* Loading Text */}
      {loading && <p className="text-center text-white font-semibold mt-4 animate-pulse">Processing audio...</p>}

      {/* Transcription Display */}
      {transcription && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Transcription:</h3>
          <p className="whitespace-pre-wrap text-gray-700">{transcription}</p>
        </div>
      )}
    </div>
  );
}