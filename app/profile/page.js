"use client";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { Bowlby_One_SC } from 'next/font/google';
import { FaHome } from 'react-icons/fa'; // Import only the icons you need
import { useRouter } from 'next/navigation';

const bowlbyOne = Bowlby_One_SC({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function EditProfilePage() {
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch('/api/profile', { // Fetching from the correct endpoint
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserName(data.name);
        setEmail(data.email); // Set email from the response
      } catch (error) {
        setError(error?.message || "An unknown error occurred");
      }
    };

    fetchUserData();
  }, []);

  const handleHomeClick = () => {
    if (isClient) {
      router.push('/'); // Redirect to the homepage
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userName, email: email }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      setLoading(false);
      router.push('/profile'); // Redirect after saving profile
    } catch (error) {
      setError(error?.message || "An error occurred while saving your profile.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[url('/bg.png')] bg-cover bg-center">
      <div className="w-[50px] sm:w-[60px] bg-[#0678b8] fixed left-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center py-4 rounded-full sm:flex sm:flex-col sm:space-y-4 sm:px-2">
        <div className="space-y-2 sm:space-y-4">
          <div
            className={`text-white text-2xl p-2 cursor-pointer rounded-full`}
            onClick={handleHomeClick}
          >
            <FaHome />
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <div className="relative w-full">
          <Image
            src="/logo.png"
            alt="Hear Wise"
            width={1000}
            height={1000}
            priority
            className="absolute top-2 left-[1.75rem] sm:top-4 md:top-4 w-[5vw] h-[5vw] sm:w-[10vw] sm:h-[10vw] md:w-[6vw] md:h-[6.6vw]"
          />
          <img 
            src="/nav.png" 
            alt="navbar" 
            className="inset-x-0"
          />
          <h1 className={`${bowlbyOne.className} absolute inset-x-0 top-1 flex justify-center text-[1.9ch] md:text-[3ch] xl:top-3 xl:text-[5ch] font-bold tracking-wide text-white`}>
            HearWise
          </h1>
        </div>

        <div className="flex flex-col items-center p-4 sm:p-6">
          <h2 className="text-4xl sm:text-5xl font-semibold text-gray-800 text-center mb-3">
            Edit Your Profile, {userName || "[Username]"}!
          </h2>
          <p className="text-gray-600 text-center text-md sm:text-lg mb-6">Update your profile information below.</p>

          <div className="flex flex-col items-center space-y-4 w-full sm:w-[350px]">
            <div className="w-full flex flex-col items-center space-y-2">
              <input
                type="text"
                placeholder="Enter your name"
                value={userName || ''}
                onChange={(e) => setUserName(e.target.value)}
                className=" text-black w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0678b8]"
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={email || ''}
                onChange={(e) => setEmail(e.target.value)}
                className="text-gray-500 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0678b8]"
                readOnly // To prevent email editing directly
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              className="w-full px-4 py-2 text-white font-bold tracking-wide bg-[#0678b8] rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
