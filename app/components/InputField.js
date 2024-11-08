import React from 'react';

export default function InputField({ 
  icon: Icon, 
  type, 
  name, 
  placeholder, 
  value, 
  onChange, 
  required = true 
}) {
  return (
    <div className="relative flex items-center border-b-2 border-gray-300 focus-within:border-blue-500 transition-colors duration-200">
      <Icon className="absolute left-3 text-gray-500" />
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-10 py-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
        required={required}
      />
    </div>
  );
}