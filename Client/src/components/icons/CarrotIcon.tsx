import React from 'react';

interface CarrotIconProps {
  className?: string;
}

const CarrotIcon: React.FC<CarrotIconProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M16.5 3.5C16.5 3.5 15 5 14 7C13 9 12 12 12 12L5 19C5 19 5.5 20 7 20.5C8.5 21 10 20 10 20L17 13C17 13 20 12 21 10C22 8 22.5 5.5 22.5 5.5C22.5 5.5 20 6 18 6.5C16 7 16.5 3.5 16.5 3.5Z"
        fill="currentColor"
      />
      <path 
        d="M7 19L5.5 20.5M10 16L8 18"
        stroke="hsl(152, 45%, 18%)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CarrotIcon;
