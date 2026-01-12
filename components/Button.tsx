import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  icon,
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] px-6 py-3 rounded-lg text-base touch-manipulation";
  
  const variants = {
    primary: "bg-gold-500 hover:bg-gold-600 text-dark-900 focus:ring-gold-500 shadow-md",
    secondary: "bg-dark-900 hover:bg-dark-800 text-white focus:ring-dark-700 shadow-md",
    outline: "border-2 border-gold-500 text-gold-600 hover:bg-gold-50 focus:ring-gold-500",
    ghost: "text-neutral-600 hover:text-dark-900 hover:bg-neutral-100",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};