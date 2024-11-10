import Image from 'next/image';
import { Bowlby_One_SC } from 'next/font/google';
import { useRouter } from 'next/navigation'; // Import useRouter

const bowlbyOne = Bowlby_One_SC({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Header({ Name }) {
  const router = useRouter(); // Initialize router

  const handleLogoClick = () => {
    router.push('/login'); // Navigate to the home page (or login page) when the logo is clicked
  };

  return (
    <div className="relative w-full">
      {/* Logo */}
      <Image
        src="/logo.png"
        alt="Hear Wise"
        width={1000}
        height={1000}
        priority
        className="absolute top-2 left-2 sm:top-4 md:top-4 w-[5vw] h-[5vw] sm:w-[10vw] sm:h-[10vw] md:w-[5vw] md:h-[5.5vw] z-10"
      />

      {/* Navbar */}
      <img
        src="/nav.png"
        alt="navbar"
        className="absolute inset-x-0 top-0 w-full h-auto"
      />

      {/* Title */}
      <h1
        className={`${bowlbyOne.className} absolute inset-x-0 top-1 flex justify-center text-[1.9ch] md:text-[3ch] xl:top-3 xl:text-[5ch] font-bold tracking-wide text-white `}
      >
        {Name}
      </h1>

      {/* Logout Button */}
      <div 
        className="absolute top-2 right-2 sm:top-4 md:top-4 z-10 cursor-pointer"
        onClick={handleLogoClick}
      >
        <img 
          src="/logout.png" 
          alt="Logo" 
          className="w-[5vw] h-[5vw] sm:w-[10vw] sm:h-[10vw] md:w-[4vw] md:h-[4.4vw]" 
        />
      </div> 
    </div>
  );
}
