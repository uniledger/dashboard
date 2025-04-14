import React, { useState, useEffect } from 'react';
import PageHeader from '../shared/PageHeader';

const API_BASE_URL = 'https://ledger.dev.ledgerrocket.com';

/**
 * Entity List component to display all entities
 */
const EntityList = ({ entities, onViewDetails, onViewJson, onRefresh }) => {
  const [entityStats, setEntityStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch entity statistics (account and ledger counts)
  useEffect(() => {
    const fetchEntityStats = async () => {
      setLoading(true);
      try {
        const stats = {};
        
        // Fetch stats for each entity
        for (const entity of entities) {
          // Get ledger count
          const ledgersResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-ledgers/?entity_id=${entity.entity_id}`);
          const ledgersData = await ledgersResponse.json();
          
          // Get account count
          const accountsResponse = await fetch(`${API_BASE_URL}/api/v1/enriched-accounts/?entity_id=${entity.entity_id}`);
          const accountsData = await accountsResponse.json();
          
          stats[entity.entity_id] = {
            ledgerCount: ledgersData.length,
            accountCount: accountsData.length
          };
        }
        
        setEntityStats(stats);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching entity stats:', err);
        setLoading(false);
      }
    };

    if (entities && entities.length > 0) {
      fetchEntityStats();
    } else {
      setLoading(false);
    }
  }, [entities]);

  // Helper function for country display
  const getCountryDisplay = (entity) => {
    if (!entity) return 'N/A';
    
    // Handle when r_country is available
    if (entity.r_country) {
      return `${entity.r_country.name} (${entity.r_country.country_code})`;
    }
    
    // Fallback to just country code
    return entity.country_code || 'N/A';
  };

  return (
    <div>
      <PageHeader 
        title="Entities Overview" 
        buttonText="+ New Entity" 
        onButtonClick={() => console.log('Create new entity')}
        refreshButton={true}
        onRefresh={onRefresh}
      />
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entity Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                # Accounts
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                # Ledgers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
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
            ) : entities && entities.length > 0 ? entities.map((entity) => {
              const stats = entityStats[entity.entity_id] || { ledgerCount: 0, accountCount: 0 };
              
              return (
                <tr key={entity.entity_id} className="hover:bg-gray-50">
                  <td 
                    className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline"
                    onClick={() => onViewDetails(entity.entity_id)}
                  >
                    {entity.entity_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entity.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entity.type || entity.entity_type || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getCountryDisplay(entity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stats.accountCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stats.ledgerCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      className="text-gray-600 hover:text-gray-800"
                      onClick={() => onViewJson(entity, `Entity: ${entity.name}`)}
                    >
                      JSON
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No entities found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntityList;