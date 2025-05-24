import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../utils/cn';

interface ProcessStepProps {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

export const ProcessStep: React.FC<ProcessStepProps> = ({
  number,
  title,
  isActive,
  isCompleted,
}) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div 
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-sm font-medium",
          isActive && "bg-primary-600 text-white scale-110",
          isCompleted && "bg-green-600 text-white",
          !isActive && !isCompleted && "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
        )}
      >
        {isCompleted ? <Check size={20} /> : number}
      </div>
      <span 
        className={cn(
          "text-xs md:text-sm text-gray-600 dark:text-gray-400",
          isActive && "text-primary-700 dark:text-primary-300 font-medium",
          isCompleted && "text-green-700 dark:text-green-300 font-medium"
        )}
      >
        {title}
      </span>
    </div>
  );
};