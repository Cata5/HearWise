"use client";
import { useState } from "react";
import Image from "next/image";
import { FaUser, FaEnvelope } from "react-icons/fa";
import InputField from "../components/InputField";
import PasswordField from "../components/passwordField";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isChecked) {
      setError("Please agree to the terms and conditions.");
      return;
    }
    
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login page upon successful registration
        window.location.href = "/login";
      } else {
        // If the email already exists or other error occurs, display the error message
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[url('/bg.png')] flex items-center justify-center p-4 bg-cover bg-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Image Section with rounded left corners */}
        <div className="flex items-center justify-center md:w-1/2 h-48 md:h-auto p-4 rounded-l-xl" 
          style={{ backgroundImage: "url('/bk1.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="p-4 scale-50 md:scale-100 rounded-full">
              <Image
                src="/logo.png"
                alt="Hear Wise"
                width={200}
                height={200}
                priority
              />
            </div>
        </div>

        {/* Right Form Section with rounded corners */}
        <div className="md:w-1/2 rounded-r-xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600">Join our community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              icon={FaUser}
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />

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

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="mr-2 w-4 h-4 text-[#0077B6] focus:ring-[#0077B6] border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-gray-600">
                I agree to the{" "}
                <a href="/terms" className="text-[#0077B6] hover:text-[#006398] font-medium underline">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0077B6] text-white font-semibold rounded-lg
                hover:bg-[#006398] focus:ring-4 focus:ring-blue-200 transition-all
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
              ) : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#0077B6] hover:text-[#006398] font-medium hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
