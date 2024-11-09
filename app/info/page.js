'use client';

import { useState } from "react";
import Sidebar from '../components/Sidebar'
import Header from '../components/Header';

export default function AboutUsPage() {
  const [activeSection, setActiveSection] = useState('about');

  return (
    <div className="min-h-screen flex bg-[url('/bg.png')] bg-cover bg-center">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="flex-grow">
        {/* Header */}
        <Header Name={"Info"} />


        {/* Team Section */}
        <div className="flex justify-center mt-[17rem] mx-[2rem] "> {/* Softer margin */}
          <div className="bg-gray-200 py-10 px-8 max-w-[1100px] mx-auto text-gray-800 text-center text-lg sm:text-xl md:text-2xl font-medium rounded-lg shadow-lg space-y-4">
            <p>
              We’re a passionate team from Romania, dedicated to helping people achieve a clear understanding of what they hear. We aim to support those with hearing difficulties by creating tools for better communication and learning.
            </p>
            <p>
              HearWise is dedicated to enhancing communication for individuals with hearing impairments and those who find spoken words challenging to understand. Our platform offers real-time transcription, acting like live subtitles, and saves conversations for easy access anytime. With an intuitive, customizable interface and local use of Whisper AI, HearWise makes communication inclusive and accessible.
            </p>
          </div>
        </div>

        {/* Contact Us Button */}
        <div className="flex flex-col items-center">
          <button className="w-[300px] px-4 py-2 text-white font-bold tracking-wide bg-blue-600 rounded-md hover:bg-blue-700">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
