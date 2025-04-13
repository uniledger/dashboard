import React from 'react';
import PageHeader from '../shared/PageHeader';

/**
 * Entity List component to display all entities
 */
const EntityList = ({ entities, accounts, ledgers, onViewDetails, onViewJson }) => {
  return (
    <div>
      <PageHeader 
        title="Entities Overview" 
        buttonText="+ New Entity" 
        onButtonClick={() => console.log('Create new entity')} 
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
            {entities && entities.length > 0 ? entities.map((entity) => {
              // Count accounts and ledgers for this entity
              const entityAccounts = accounts.filter(a => 
                a.entity_id === entity.entity_id || 
                (a.enriched_ledger && a.enriched_ledger.entity_id === entity.entity_id)
              );
              const entityLedgers = ledgers.filter(l => 
                l.entity_id === entity.entity_id
              );
              
              return (
                <tr key={entity.entity_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entity.entity_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entity.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entity.country || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entityAccounts.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entityLedgers.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() => onViewDetails(entity.entity_id)}
                    >
                      View Details
                    </button>
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
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
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