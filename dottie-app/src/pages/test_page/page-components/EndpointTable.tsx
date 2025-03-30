import React, { ReactNode } from 'react';

interface EndpointTableProps {
  title: string;
  children: ReactNode;
}

/**
 * A reusable table component for displaying API endpoints
 */
export default function EndpointTable({ title, children }: EndpointTableProps) {
  return (
    <div className="my-8">
      <div className="bg-gray-800 p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4 text-left text-white font-medium w-1/3">Endpoint</th>
              <th className="p-4 text-left text-white font-medium w-1/3">Expected Output</th>
              <th className="p-4 text-left text-white font-medium w-1/3">Actual Output</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
} 