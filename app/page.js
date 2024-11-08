"use client";
import { useEffect, useState } from "react";
import { fetchUserData } from "./utils/utils";
import Image from 'next/image';
import { Bowlby_One_SC } from 'next/font/google';
import { FaHome, FaArchive, FaInfoCircle } from 'react-icons/fa'; // Importing icons from react-icons

const bowlbyOne = Bowlby_One_SC({
  weight: '400', // Specify the weight
  subsets: ['latin'],
  display: 'swap',
});

export default function HearWisePage() {
  const [userName, setUserName] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('home'); // Track the active section

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const userData = await fetchUserData(token);
        setUserName(userData.name);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error?.message || "An unknown error occurred");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex bg-[url('/bg.png')] bg-cover bg-center">
      {/* Sidebar */}
      <div className="w-[50px] sm:w-[60px] bg-blue-600 fixed left-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center py-4 rounded-full sm:flex sm:flex-col sm:space-y-4 sm:px-2">
        {/* Icons */}
        <div className="space-y-2 sm:space-y-4">
          <div
            className={`text-white text-2xl p-2 cursor-pointer rounded-full ${activeSection === 'home' ? 'bg-black' : ''}`} // Highlight the home icon
            onClick={() => setActiveSection('home')} // Set the active section to home
          >
            <FaHome />
          </div>
          <div
            className={`text-white text-2xl cursor-pointer p-2 rounded-full ${activeSection === 'archive' ? 'bg-black' : ''}`} // Highlight the archive icon
            onClick={() => setActiveSection('archive')} // Set the active section to archive
          >
            <FaArchive />
          </div>
          <div
            className={`text-white text-2xl p-2 cursor-pointer rounded-full ${activeSection === 'info' ? 'bg-black' : ''}`} // Highlight the info icon
            onClick={() => setActiveSection('info')} // Set the active section to info
          >
            <FaInfoCircle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow"> {/* Shifted by 50px to the right for larger screens */}
        <div className="relative w-full">
          {/* Logo positioned in the top-left corner */}
          <Image
            src="/logo.png"
            alt="Hear Wise"
            width={1000}
            height={1000}
            priority
           className="absolute top-2 left-2 sm:top-4 md:top-4 w-[5vw] h-[5vw] sm:w-[10vw] sm:h-[10vw] md:w-[6vw] md:h-[6.6vw]"
          />
          
          {/* Navbar image */}
          <img 
            src="/nav.png" 
            alt="navbar" 
            className=" inset-x-0"
          />

          {/* Title positioned in the left middle of the screen */}
          <h1 className={`${bowlbyOne.className} absolute inset-x-0 top-1 flex justify-center text-[1.9ch] md:text-[3ch]  xl:top-3 xl:text-[5ch] font-bold tracking-wide text-white`}>
            HearWise
          </h1>
        </div>

        <div className="flex flex-col items-center p-4 sm:p-6">
          <h2 className="text-4xl sm:text-5xl font-semibold text-gray-800 text-center mb-3">
            Welcome back, {userName || "[Username]"}!
          </h2>
          <p className="text-gray-600 text-center text-md sm:text-lg mb-6">It’s nice to hear from you again!</p>
        </div>
        <div className="flex flex-col items-center ">
          <button className="w-[300px] px-4 py-2 text-white font-bold tracking-wide bg-blue-600 rounded-md hover:bg-blue-700">Start Transcribing</button>
        </div>
      </div>
    </div>
  );
}
