'use client';

import { useState } from "react";
import Sidebar from '../components/SideBar'
import Header from '../components/Header';

export default function AboutUsPage() {
  const [activeSection, setActiveSection] = useState('info');
  const handleLogoClick = () => {
    router.push('/'); // Navigate to the login page when the logo is clicked
  };

  return (
    <div className="min-h-screen flex bg-[url('/bg.png')] bg-cover bg-center">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="flex-grow">
        {/* Header */}
        <Header Name={"Info"} />

        {/* Team Section */}
           <div className="flex justify-center mt-[5rem] sm:mt-[17rem] mx-[2rem] ml-14 sm:ml-14 md:ml-14 lg:ml-16 xl:ml-18"> {/* Add responsive left margin */}
            <div className="bg-gray-200 py-10 px-8 max-w-[1100px] mx-auto text-gray-800 text-center text-lg sm:text-xl md:text-2xl font-medium rounded-lg shadow-lg space-y-4">
              <p>
                We’re a passionate team from Romania, dedicated to helping people achieve a clear understanding of what they hear. We aim to support those with hearing difficulties by creating tools for better communication and learning.
              </p>
              <p>
                HearWise is dedicated to enhancing communication for individuals with hearing impairments and those who find spoken words challenging to understand. Our platform offers real-time transcription, acting like live subtitles, and saves conversations for easy access anytime. With an intuitive, customizable interface and local use of Whisper AI, HearWise makes communication inclusive and accessible.
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-medium text-center text-gray-800">
                <a className="text-[#101010] font-extrabold text-2xl">Join </a>
                <a href="/" className="text-[#0077B6] hover:text-[#238EC7] font-extrabold text-2xl">HearWise</a> 
                <a className="text-[#101010] font-extrabold text-2xl"> to experience cleaner, more accessible communication.</a>
                <br/>
                <a href="/terms" className="text-[#0077B6] hover:text-[#238EC7] font-extrabold text-2xl">Terms and conditions</a> 
              </p>
            </div>
          </div>
      </div>
    </div>
  );
}
