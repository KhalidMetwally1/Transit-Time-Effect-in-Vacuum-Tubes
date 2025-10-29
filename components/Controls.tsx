
import React from 'react';
import { FrequencyMode } from '../types';

interface ControlsProps {
  selectedMode: FrequencyMode;
  onModeChange: (mode: FrequencyMode) => void;
}

const Button: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}> = ({ onClick, isActive, children }) => {
    const baseClasses = "w-full text-center px-4 py-2 rounded-md transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800";
    const activeClasses = "bg-cyan-500 text-white shadow-lg";
    const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";

    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {children}
        </button>
    );
};


export const Controls: React.FC<ControlsProps> = ({ selectedMode, onModeChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {(Object.keys(FrequencyMode) as Array<keyof typeof FrequencyMode>).map(key => (
        <Button
          key={key}
          onClick={() => onModeChange(FrequencyMode[key])}
          isActive={selectedMode === FrequencyMode[key]}
        >
          {FrequencyMode[key]} Frequency
        </Button>
      ))}
    </div>
  );
};
