import React, { useState, useEffect } from 'react';
import RulesList from './RulesList';
import RuleDetail from './RuleDetail';

// Direct fetch without CORS proxy

const TRANSACTIONS_API_BASE_URL = 'https://transactions.dev.ledgerrocket.com';

/**
 * Main component for the Rules tab
 */
const RulesView = ({ onViewJson }) => {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch rules on component mount
  useEffect(() => {
    fetchRules();
  }, []);

  // Fetch rules from the API
  const fetchRules = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${TRANSACTIONS_API_BASE_URL}/api/v1/rules/`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch rules: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setRules(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching rules:', err);
      setError(err.message || 'An error occurred while fetching rules');
      setIsLoading(false);
    }
  };

  // Handle rule selection
  const handleSelectRule = (rule) => {
    setSelectedRule(rule);
    setView('detail');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading rules...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button 
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={fetchRules}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {view === 'list' && (
        <RulesList 
          rules={rules}
          onSelectRule={handleSelectRule}
          onViewJson={onViewJson}
          onRefresh={fetchRules}
        />
      )}
      
      {view === 'detail' && selectedRule && (
        <RuleDetail 
          rule={selectedRule}
          onBack={() => setView('list')}
          onViewJson={onViewJson}
        />
      )}
    </div>
  );
};

export default RulesView;