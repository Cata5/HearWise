'use client'

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import Header from '@/app/components/Header';

const TranscriptionPage = () => {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const transcriptionName = pathname.split('/').pop();
  const [transcription, setTranscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = response.data;
          setUserEmail(userData.email);
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
          const token = localStorage.getItem('token');
          if (!token) {
            setError('No token found');
            return;
          }

          const response = await axios.get('/api/transcribe/load', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              email: userEmail,
            },
          });

          const transcriptions = response.data.transcriptions || [];
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
          setLoading(false);
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
    <div className="min-h-screen flex flex-col items-center bg-[url('/bg.png')] bg-cover bg-center">
      <Header Name={"Transcriptions"} />
      
      {/* Transcription Container */}
      <div className="relative mt-[15rem] w-full max-w-2xl bg-white rounded-lg shadow-lg p-8"> {/* Adjusted margin-top to move down */}

        {/* Blue Header Strip */}
        
        <div className="absolute top-0 left-0 w-full h-8 bg-[#238EC7] rounded-t-lg shadow-md">
        <h1 className="text-2xl text-[#fff] mb-4 font-bold text-center ">
            {transcription.name}
          </h1>
        </div>
        
        {/* Main Content Box with Border and Scrolling */}
        <div className="bg-white border-4 border-gray-300 rounded-lg p-6 mt-7 h-[250px] overflow-y-auto shadow-md">
          <p className="text-gray-600 text-base leading-relaxed font-bold">
            {transcription.transcription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPage;
