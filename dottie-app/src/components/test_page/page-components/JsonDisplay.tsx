import React from 'react';

interface JsonDisplayProps {
  data: any;
  isExpected?: boolean;
}

/**
 * Component for displaying JSON data with syntax highlighting
 */
export default function JsonDisplay({ data, isExpected = false }: JsonDisplayProps) {
  // Convert data to formatted JSON string
  const formatJson = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return 'Invalid JSON data';
    }
  };

  return (
    <div className={`p-4 rounded-md ${isExpected ? 'bg-gray-700' : 'bg-gray-700'}`}>
      <pre className={`text-sm whitespace-pre-wrap break-words ${isExpected ? 'text-gray-300' : 'text-white'}`}>
        {formatJson(data)}
      </pre>
    </div>
  );
} 