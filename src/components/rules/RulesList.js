import React, { useState } from 'react';

/**
 * Component to display a list of rules
 */
const RulesList = ({ rules, onSelectRule, onViewJson, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter rules based on search query
  const filteredRules = rules.filter(rule => 
    (rule.rule_id && rule.rule_id.toString().includes(searchQuery)) ||
    (rule.description && rule.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex justify-between items-center flex-wrap sm:flex-nowrap">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Rules</h3>
            <p className="mt-1 text-sm text-gray-500">
              Browse transaction validation rules
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search rules..."
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      <ul className="divide-y divide-gray-200">
        {filteredRules.map((rule) => (
          <li key={rule.rule_id}>
            <div className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                  <p className="text-sm font-medium text-blue-600 truncate cursor-pointer hover:underline" onClick={() => onSelectRule(rule)}>
                      Rule ID: {rule.rule_id}
                    </p>
                    <p className="text-sm text-gray-500">
                      Action: {rule.action}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 space-x-2">
                    <button
                      onClick={() => onViewJson(rule, `Rule ${rule.rule_id}`)}
                      className="px-3 py-1 border border-gray-300 text-xs rounded-md hover:bg-gray-50"
                    >
                      View JSON
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {rule.description}
                    </p>
                  </div>
                </div>
                {/* Show expression preview */}
                <div className="mt-2">
                  <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded font-mono overflow-x-auto">
                    {rule.expression && rule.expression.length > 80
                      ? `${rule.expression.substring(0, 80)}...`
                      : rule.expression}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
        {filteredRules.length === 0 && (
          <li>
            <div className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No rules found.
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default RulesList;