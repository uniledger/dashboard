import React, { useState, useEffect } from 'react';
import { ErrorAlert } from '../common';
import RulesList from './RulesList';
import RuleDetail from './RuleDetail';
import apiService from '../../services/apiService';

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
      const response = await apiService.transaction.getRules();
      console.log('Rules response:', response);
      
      // Extract data from the response object
      if (response.ok && response.data) {
        setRules(response.data);
        console.log('Setting rules:', response.data.length, 'items');
      } else {
        console.error('Failed to fetch rules:', response.error);
        setError(response.error?.message || 'Failed to fetch rules');
        setRules([]);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching rules:', err);
      setError(err.message || 'An error occurred while fetching rules');
      setRules([]);
      setIsLoading(false);
    }
  };

  // Handle rule selection
  const handleSelectRule = (rule) => {
    setSelectedRule(rule);
    setView('detail');
  };

  // Handle back button
  const handleBack = () => {
    setSelectedRule(null);
    setView('list');
  };

  // Error state
  if (error) {
    return (
      <div className="mb-6">
        <ErrorAlert 
          error={error} 
          onRetry={fetchRules} 
        />
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
          loading={isLoading}
        />
      )}
      
      {view === 'detail' && selectedRule && (
        <RuleDetail 
          rule={selectedRule}
          onBack={handleBack}
          onViewJson={onViewJson}
        />
      )}
    </div>
  );
};

export default RulesView;