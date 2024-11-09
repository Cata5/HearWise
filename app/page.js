'use client';

import { useEffect, useState } from 'react';
import { fetchUserData } from './utils/utils';  // Ensure this is the correct path to your helper functions
import Sidebar from './components/SideBar'; 
import Header from './components/Header';
import { useRouter } from 'next/navigation';

export default function HearWisePage() {
  const [userName, setUserName] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isClient, setIsClient] = useState(false); // To check if the component is mounted on the client side
  const router = useRouter(); // Hook for navigation

  useEffect(() => {
    setIsClient(true); // Set the state to true after component mounts (client side)
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isClient) {
        const token = localStorage.getItem('token'); // Get token from localStorage
        console.log('Token from localStorage:', token); // Log token to see if it's being retrieved properly
        if (!token) return;

        try {
          const userData = await fetchUserData(token); // Fetch user data with the token
          console.log('Fetched user data:', userData); // Log user data
          setUserName(userData.name); // Set the username to state
        } catch (error) {
          console.error('Error fetching user data:', error); // Log any errors during data fetching
        }
      }
    };

    fetchData();
  }, [isClient]); // Fetch data after `isClient` is set to true to ensure it's only done client-side

  if (!isClient) {
    return null; // Prevent rendering before component is mounted on the client side
  }

  const handleLogoClick = () => {
    router.push('/profile'); // Navigate to the login page when the logo is clicked
  };

  const handleTranscribeClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      return;
    }

    // Navigate to the /transcribe page
    router.push('/transcribe');
  };

  return (
    <div className="min-h-screen flex bg-[url('/bg.png')] bg-cover bg-center relative">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="flex-grow">
        <Header Name={'HearWise'} />
        
        <div className="flex flex-col items-center justify-center p-4 sm:p-6 mt-[17rem]">
          <h2 className="text-4xl sm:text-5xl font-semibold text-gray-800 text-center mb-3">
            Welcome back, {userName || "[Username]"}!
          </h2>
          <p className="text-gray-600 text-center text-md sm:text-lg mb-6">
            It’s nice to hear from you again!
          </p>
          <button
            className="bg-[#0678fe] p-2 rounded-md max-w-[15ch]"
            onClick={handleTranscribeClick}
          >
            Start Transcribing
          </button>
        </div>
      </div>

      {/* Logo in the top-right corner */}
      <div 
        className="absolute top-4 right-4 cursor-pointer"
        onClick={handleLogoClick}
      >
        <img src="/account.png" alt="Logo" className="h-[7ch] w-auto invert" />
      </div>
    </div>
  );
}
