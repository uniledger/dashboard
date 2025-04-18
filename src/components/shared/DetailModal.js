import React from 'react';

/**
 * Modal component to display detailed JSON data for any record
 * with improved readability and copy functionality
 */
const DetailModal = ({ isOpen, data, title, onClose }) => {
  if (!isOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      .then(() => {
        // Could add a toast notification here
        console.log('JSON copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy JSON:', err);
      });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="border-b px-6 py-3 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {/* Add an explanation of what they're viewing */}
          <p className="mb-4 text-sm text-gray-500">
            Viewing complete data for {title}
          </p>
          
          {/* Add a copy button */}
          <div className="flex justify-end mb-2">
            <button 
              onClick={handleCopyJson}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm flex items-center"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy JSON
            </button>
          </div>
          
          {/* Improve the JSON display */}
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm border border-gray-200">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;