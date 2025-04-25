import React from 'react';

interface ButtonProps {
  label: string;
  variant: 'primary' | 'secondary' | 'accent'; // Added 'accent' variant
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset'; 
}

const Button: React.FC<ButtonProps> = ({ label, variant, onClick, className = "", type = 'button' }) => {
  // Base styling for all buttons
  const baseClass = "px-4 py-2 rounded";

  // Variant-specific styles based on the variant
  const buttonClass = variant === 'primary'
    ? 'bg-[#3498DB] hover:bg-[#2C3E50] text-white'
    : variant === 'secondary'
    ? 'bg-[#F4D03F] hover:bg-[#FFFFFF] text-black border-transparent hover:border-black border-2'
    : 'bg-[#2C3E50] hover:bg-[#3498DB] text-white';

  // // Use Tailwind classes based on the variant
  // const tailwindClass = variant === 'primary'
  // ? 'btn-primary'
  // : variant === 'secondary'
  // ? 'btn-secondary'
  // : 'btn-accent'; // Default to 'btn-accent' if variant is not 'primary' or 'secondary'

  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${buttonClass} ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;