import React from 'react';
import { useDashboard } from '../../../context/DashboardContext';

/**
 * Dashboard header component with auto-refresh controls
 */
const DashboardHeader = () => {
  const { 
    autoRefreshEnabled, 
    setAutoRefreshEnabled 
  } = useDashboard();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">
          </h1>
          <div className="flex items-center">
            <button 
              onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
              className={`px-2 py-1 text-xs rounded-md ${autoRefreshEnabled 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-gray-100 text-gray-800 border border-gray-200'}`}
              title={autoRefreshEnabled ? "Auto-refresh balances is on" : "Auto-refresh balances is off"}
            >
              {autoRefreshEnabled ? "Auto-Refresh Balances: ON" : "Auto-Refresh Balances: OFF"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;