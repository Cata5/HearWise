'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import axios from 'axios';
import Link from 'next/link'; // Import Link for navigation

import Sidebar from '../components/SideBar'; // Import Sidebar
import Header from '../components/Header'; // Import Header

const RepoPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const router = useRouter(); // Initialize router for navigation
  
  // Set isClient to true once the component is mounted to ensure client-side rendering
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
          setUserEmail(userData.email);
          setUserName(userData.name);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Error fetching user data');
        }
      }
    };

    fetchData();
  }, [isClient]);

  // Fetch transcriptions after the user email is available
  useEffect(() => {
    if (userEmail) {
      const fetchTranscriptions = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await axios.get(`/api/transcribe/load?email=${userEmail}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTranscripts(response.data.transcriptions || []);
        } catch (err) {
          console.error('Error fetching transcriptions:', err);
          setError('Error fetching transcriptions');
        }
      };

      fetchTranscriptions();
    }
  }, [userEmail]);

  // Handle logo click to navigate to home
  const handleLogoClick = () => {
    router.push('/'); // Navigate to the home page when the logo is clicked
  };

  // Show client-side rendering in progress if the component is still mounting
  if (!isClient) {
    return <p className="text-center text-xl font-semibold mt-4">Client-side rendering in progress...</p>;
  }

  return (
    <div className="min-h-screen flex bg-[url('/bg.png')] bg-cover bg-center">
      {/* Sidebar */}
      <Sidebar activeSection="transcriptions" />

      {/* Main Content */}
      <div className="flex-grow">
        {/* Header */}
        <Header Name={"Your Transcriptions"} />

        {/* Transcription Section */}
        <div className="mt-[17rem] flex justify-end px-12">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {error && (
              <p className="text-red-600 text-center">{error}</p>
            )}
            {userEmail && (
              <p className="text-lg text-center text-gray-700 mb-6">
                Welcome, <span className="font-semibold">{userName}</span> ({userEmail})
              </p>
            )}
            {transcripts.length > 0 ? (
              transcripts.map((transcription, index) => (
                <Link key={index} href={`/transcriptions/${transcription.name}`} passHref>
                  <div className="bg-gray-200 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow cursor-pointer text-center space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">{transcription.name}</h2>
                    <p className="text-gray-600">{transcription.transcription}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No transcriptions available.</p>
            )}
          </div>
        </div>


        {/* Logo to navigate home */}
        <div className="absolute top-0 left-4 cursor-pointer" onClick={handleLogoClick}>
          <img src="/left-logo.png" alt="Left Logo" className="h-[7ch] w-auto mb-[10px]" />
        </div>
        <div
          className="absolute top-0 right-4 cursor-pointer"
          onClick={handleLogoClick}
        >
          <img src="/main.png" alt="Logo" className="h-[7ch] w-auto invert mb-[10px]" />
        </div>
      </div>
    </div>
  );
};

export default RepoPage;
