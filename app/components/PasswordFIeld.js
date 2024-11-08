import React from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function PasswordField({ value, onChange, showPassword, onTogglePassword }) {
  return (
    <div className="relative flex items-center border-b-2 border-gray-300 focus-within:border-blue-500 transition-colors duration-200">
      <FaLock className="absolute left-3 text-gray-500" />
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        id="password"
        placeholder="Create a password"
        value={value}
        onChange={onChange}
        className="w-full px-10 py-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
        required
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-3 focus:outline-none"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <FaEyeSlash className="text-gray-500 hover:text-gray-700 transition-colors" />
        ) : (
          <FaEye className="text-gray-500 hover:text-gray-700 transition-colors" />
        )}
      </button>
    </div>
  );
}