import React from 'react';

interface ButtonProps {
  label: string;
  variant: 'primary' | 'secondary' | 'accent'; // Added 'accent' variant
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset'; 
}

const Button: React.FC<ButtonProps> = ({ label, variant, onClick, className = "", type = 'button' }) => {
  // Use Tailwind classes based on the variant
  const buttonClass = variant === 'primary'
    ? 'btn-primary'
    : variant === 'secondary'
    ? 'btn-secondary'
    : 'btn-accent'; // Default to 'btn-accent' if variant is not 'primary' or 'secondary'

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