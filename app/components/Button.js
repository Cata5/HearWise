// components/Button.js
import React from 'react';

const Button = ({
  onClick,
  children,
  type = 'button',
  className = '',
  disabled = false,
  variant = 'primary',
}) => {
  const baseStyles =
    'w-full py-3 bg-[#0077B6] text-white font-semibold rounded-lg hover:bg-[#006398] focus:ring-4 focus:ring-blue-200 transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center';

  // Adjusting for variants if needed (optional)
  const variantStyles = {
    primary: baseStyles, // Assign baseStyles to primary variant by default
    // You can add more styles here if needed for different variants
  };

  return (
    <button
      type={type}
      className={`${variantStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
