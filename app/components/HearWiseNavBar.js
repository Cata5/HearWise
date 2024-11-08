import Link from "next/link";

export default function HearWiseNavBar({ userName }) {
  return (
    <nav className="bg-green-500 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          HearWise
        </Link>

        {/* Welcome message or login link */}
        <div className="flex items-center space-x-4">
          {userName ? (
            <span>Welcome, {userName}!</span>
          ) : (
            <Link href="/login" className="hover:underline">
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
