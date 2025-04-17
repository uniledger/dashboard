import React from 'react';
import { FileJson } from 'lucide-react';
import { Tooltip } from "@nextui-org/react";
/**
 * Reusable action button component with consistent styling
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ReactNode} props.icon - Optional icon
 * @param {string} props.variant - Button variant (primary, secondary, outline, danger)
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether the button is disabled
 * @returns {JSX.Element} - Rendered component
 */
const ActionButton = ({ 
  children, 
  icon, 
  variant = 'primary', 
  onClick, 
    className = '',
    disabled = false,
    jsonButton=false
}) => {
    
    if (jsonButton)
    {
        return (
          <Tooltip content="View JSON">
                <button onClick={onClick} className="inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 border-transparent text-white bg-gray-600 hover:bg-gray-700 focus:ring-gray-500">
                    <FileJson className="mr-2 -ml-1 h-5 w-5"/>
                </button>
            </Tooltip>
      );
    }


    // Define button styles based on variant
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "border-transparent text-white bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
    outline: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500",
    danger: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
  };
  
  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button
      type="button"
      className={`${baseStyle} ${variantStyles[variant]} ${className} ${disabledStyle}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <span className="mr-2 -ml-1 h-5 w-5">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};
    
    
export default ActionButton;