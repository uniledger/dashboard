import React, { useState, useEffect } from 'react';
import PageHeader from '../shared/PageHeader';

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

  // Helper function for country display
  const getCountryDisplay = (item) => {
    if (!item) return 'N/A';
    
    // Handle when r_country is available
    if (item.r_country) {
      return `${item.r_country.name} (${item.r_country.country_code})`;
    }
    
    // Fallback to just country code
    return item.country_code || 'N/A';
  };

  // Add debugging for component rendering
  console.log('LedgerList render, ledgers count:', ledgers?.length || 0);
      
  return (
    <div>
      <PageHeader 
        title="Ledgers" 
        buttonText="+ New Ledger" 
        onButtonClick={() => console.log('Create new ledger')}
        refreshButton={true}
        onRefresh={onRefresh}
      />
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ledgers && ledgers.length > 0 ? ledgers.map((ledger) => {
            // Find the associated entity
            const entity = entities.find(e => e.entity_id === ledger.entity_id) || ledger.r_entity;
            const entityId = entity?.entity_id || ledger.entity_id;
            
            return (
              <div key={ledger.ledger_id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{ledger.name}</h3>
                  <span 
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-blue-200"
                    onClick={() => onViewDetails(ledger.ledger_id)}
                  >
                    ID: {ledger.ledger_id}
                  </span>
                </div>
                <p className="text-gray-500 mt-1">{ledger.description || 'No description'}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Entity</p>
                    <p 
                      className={`text-gray-900 ${entityId ? 'text-blue-600 cursor-pointer hover:underline' : ''}`}
                      onClick={() => entityId && onViewEntity && onViewEntity(entityId)}
                    >
                      {entity?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Currency</p>
                    <p className="text-gray-900">
                      {ledger.r_currency ? `${ledger.r_currency.currency_code} (${ledger.r_currency.type})` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="text-gray-900">{getCountryDisplay(ledger)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-gray-900">{new Date(ledger.created_at || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => onViewDetails(ledger.ledger_id)}
                  >
                    View Details
                  </button>
                  <button 
                    className="text-sm text-gray-600 hover:text-gray-800"
                    onClick={() => onViewJson(ledger, `Ledger: ${ledger.name}`)}
                  >
                    View JSON
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-2 text-center p-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No ledgers found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LedgerList;