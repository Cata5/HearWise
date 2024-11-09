'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';

const TranscriptionPage = () => {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();  // Get the pathname
  const transcriptionName = pathname.split('/').pop(); // Extract the transcription name from the URL
  const [transcription, setTranscription] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null); // State to store the email

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user profile data (email, name) after the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      if (isClient) {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await axios.get('/api/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = response.data;
          setUserEmail(userData.email); // Save the email
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Error fetching user data');
        }
      }
    };

    fetchData();
  }, [isClient]);

  useEffect(() => {
    if (userEmail) {
      const fetchTranscriptions = async () => {
        try {
          const token = localStorage.getItem('token'); // Get the token from localStorage
          if (!token) {
            setError('No token found');
            return;
          }

          const response = await axios.get('/api/transcribe/load', {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token if needed
            },
            params: {
              email: userEmail,  // Include the email as a query parameter
            },
          });

          const transcriptions = response.data.transcriptions || [];

          // Filter for the requested transcription
          const filteredTranscription = transcriptions.find(
            (t) => t.name === transcriptionName
          );

          if (filteredTranscription) {
            setTranscription(filteredTranscription);
          } else {
            setError('Transcription not found');
          }
        } catch (err) {
          console.error('Error fetching transcriptions:', err);
          setError('Error fetching transcriptions');
        } finally {
          setLoading(false);  // Set loading to false when the data is fetched
        }
      };

      fetchTranscriptions();
    }
  }, [userEmail, transcriptionName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold">Loading transcription...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  if (!transcription) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-gray-500">No transcription available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[url('/bg.png')] bg-cover bg-center">
      <div className="flex-grow">
        <div className="flex justify-center mt-12">
          <h1 className="text-4xl font-bold text-gray-800 bg-gray-200 py-4 px-6 rounded-lg shadow-md">
            Transcription: {transcription.name}
          </h1>
        </div>

        <div className="mt-8 px-4 md:px-12">
          <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800">{transcription.name}</h2>
            <p className="text-gray-600">{transcription.transcription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPage;
