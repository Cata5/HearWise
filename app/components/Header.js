import Image from 'next/image';
import { Bowlby_One_SC } from 'next/font/google';

const bowlbyOne = Bowlby_One_SC({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Header({ Name }) {
  return (
    <div className="relative w-full">
      <Image
        src="/logo.png"
        alt="Hear Wise"
        width={1000}
        height={1000}
        priority
        className="absolute top-2 left-2 sm:top-4 md:top-4 w-[5vw] h-[5vw] sm:w-[10vw] sm:h-[10vw] md:w-[6vw] md:h-[6.6vw] z-10"
      />

      <img
        src="/nav.png"
        alt="navbar"
        className="absolute inset-x-0 top-0 w-full h-auto"
      />

      <h1
        className={`${bowlbyOne.className} absolute inset-x-0 top-1 flex justify-center text-[1.9ch] md:text-[3ch] xl:top-3 xl:text-[5ch] font-bold tracking-wide text-white `}
      >
        {Name}
      </h1>
    </div>
  );
}
