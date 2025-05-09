import React, { useState, useEffect } from 'react';
import { ErrorAlert } from '../common';
import RulesList from './RulesList';
import RuleDetail from './RuleDetail';
import apiService from '../../services/apiService';

/**
 * Manages the display of transaction rules, allowing users to view a list of rules
 * or the details of a specific rule. It fetches rule data using `apiService`.
 *
 * @param {Object} props - Component props.
 * @param {function} [props.onViewJson] - Callback function to display raw JSON data for an item.
 * @returns {JSX.Element} The rendered RulesView component, showing either `RulesList` or `RuleDetail`.
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

  /**
   * Fetches the list of transaction rules from the API and updates the component's state.
   * Handles loading and error states during the fetch operation.
   */
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

  /**
   * Sets the selected rule and switches the view to the rule detail display.
   *
   * @param {Object} rule - The rule object to be selected.
   */
  const handleSelectRule = (rule) => {
    setSelectedRule(rule);
    setView('detail');
  };

  /**
   * Clears the selected rule and switches the view back to the rules list display.
   */
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