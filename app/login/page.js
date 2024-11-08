"use client";
import { useState } from "react";
import Image from "next/image";
import { FaEnvelope } from "react-icons/fa";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordFIeld";
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Image Section */}
        <div className="md:w-1/2 relative h-48 md:h-auto">
          <Image
            src="/Modern Illustrative Recipe Book Cover.png"
            alt="Recipe Book Cover"
            layout="fill"
            objectFit="cover"
            priority
            className="hidden md:block"
          />
          <Image
            src="/Modern Illustrative Recipe Book Cover Mobile.png"
            alt="Recipe Book Cover Mobile"
            layout="fill"
            objectFit="cover"
            priority
            className="md:hidden"
          />
        </div>

        {/* Right Form Section */}
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              icon={FaEnvelope}
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

            <PasswordField
              value={formData.password}
              onChange={handleChange}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-green-600 hover:text-green-700 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg
                hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all
                duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed
                flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-green-600 hover:text-green-700 font-medium hover:underline"
            >
              Create account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}