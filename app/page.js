'use client';

import { useEffect, useState } from 'react';
import { fetchUserData } from './utils/utils';
import Sidebar from './components/SideBar'; // Make sure this is named correctly
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
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const userData = await fetchUserData(token);
          setUserName(userData.name);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchData();
  }, [isClient]); // Fetch data after isClient is set to true

  if (!isClient) {
    return null; // Avoid rendering before the component is mounted on the client side
  }

  // Handle logo click to navigate to the login page
  const handleLogoClick = () => {
    router.push('/login'); // Navigate to login page
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
          <p className="text-gray-600 text-center text-md sm:text-lg mb-6">It’s nice to hear from you again!</p>
          <button className="bg-[#0678fe] p-2 rounded-md max-w-[15ch]" onClick={() => router.push('/transcribe')}>Start Transcribing</button>
        </div>
      </div>

      {/* Logo in the top-right corner */}
      <div 
        className="absolute top-4 right-4 cursor-pointer"
        onClick={handleLogoClick}
      >
        <img src="/public/account.png" alt="Logo" className="h-[10ch] w-auto" />
      </div>
    </div>
  );
}
