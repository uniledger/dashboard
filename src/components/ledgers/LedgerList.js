import React, { useState, useEffect } from 'react';
import { getCountryDisplay } from '../../utils/formatters';

const API_BASE_URL = 'https://ledger.dev.ledgerrocket.com';

/**
 * Ledger List component to display all ledgers
 * with API-based filtering
 */
const LedgerList = ({ ledgers, onViewDetails, onViewJson, onRefresh, onViewEntity }) => {
  const [loading, setLoading] = useState(true);
  const [entities, setEntities] = useState([]);

  // Fetch entities for displaying entity names
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/enriched-entities/`);
        const data = await response.json();
        setEntities(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching entities:', err);
        setLoading(false);
      }
    };

    fetchEntities();
  }, []);

  // Add debugging for component rendering
  console.log('LedgerList render, ledgers count:', ledgers?.length || 0);
      
  return (
    <div>
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={onRefresh}
          className="px-3 py-1 rounded border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 flex items-center"
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ledger Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : ledgers && ledgers.length > 0 ? ledgers.map((ledger) => {
              // Find the associated entity
              const entity = entities.find(e => e.entity_id === ledger.entity_id) || ledger.r_entity;
              const entityId = entity?.entity_id || ledger.entity_id;
              
              return (
                <tr key={ledger.ledger_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline"
                      onClick={() => onViewDetails(ledger.ledger_id)}>
                    {ledger.ledger_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ledger.name}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${entityId ? 'text-blue-600 cursor-pointer hover:underline' : 'text-gray-500'}`}
                      onClick={() => entityId && onViewEntity && onViewEntity(entityId)}>
                    {entity?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ledger.r_currency ? `${ledger.r_currency.currency_code} (${ledger.r_currency.type})` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {console.log('Ledger country data:', ledger.country_code, ledger.r_country) || getCountryDisplay(ledger)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ledger.description || 'No description'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <button 
                      className="text-gray-600 hover:text-gray-800"
                      onClick={() => onViewJson(ledger, `Ledger: ${ledger.name}`)}
                    >
                      JSON
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No ledgers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerList;