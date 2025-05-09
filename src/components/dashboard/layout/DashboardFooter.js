import React from 'react';

/**
 * Footer component for the main dashboard layout.
 * Displays copyright information and links to API documentation (Ledger and Transactions APIs).
 * It does not take any direct props.
 * 
 * @returns {JSX.Element} The rendered DashboardFooter component.
 */
const DashboardFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm"> @2025 LedgerRocket. All rights reserved.</p>
          <div className="flex space-x-2 text-sm">
            <a 
              href="https://ledger.dev.ledgerrocket.com/openapi.json" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700"
            >
              Ledger API
            </a>
            <span className="text-gray-400">|</span>
            <a 
              href="https://transactions.dev.ledgerrocket.com/openapi.json" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700"
            >
              Transactions API
            </a>
            <span className="text-gray-400">|</span>
            <a 
              href="https://ledger.dev.ledgerrocket.com/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700"
            >
              Ledger Docs
            </a>
            <span className="text-gray-400">|</span>
            <a 
              href="https://transactions.dev.ledgerrocket.com/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700"
            >
              Transactions Docs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;