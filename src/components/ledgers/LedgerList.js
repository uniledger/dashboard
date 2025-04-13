import React from 'react';
import PageHeader from '../shared/PageHeader';

/**
 * Ledger List component to display all ledgers
 */
const LedgerList = ({ ledgers, entities, accounts, onViewDetails, onViewJson }) => {
  return (
    <div>
      <PageHeader 
        title="Ledgers" 
        buttonText="+ New Ledger" 
        onButtonClick={() => console.log('Create new ledger')} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ledgers && ledgers.length > 0 ? ledgers.map((ledger) => {
          // Find the associated entity
          const entity = entities.find(e => e.entity_id === ledger.entity_id);
          
          // Count accounts for this ledger
          const ledgerAccounts = accounts.filter(a => 
            a.ledger_id === ledger.ledger_id || 
            (a.enriched_ledger && a.enriched_ledger.ledger_id === ledger.ledger_id)
          );
          
          return (
            <div key={ledger.ledger_id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium text-gray-900">{ledger.name}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  ID: {ledger.ledger_id}
                </span>
              </div>
              <p className="text-gray-500 mt-1">{ledger.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Entity</p>
                  <p className="text-gray-900">{entity?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Currency</p>
                  <p className="text-gray-900">{ledger.r_currency?.currency_code || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="text-gray-900">{ledger.country || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Accounts</p>
                  <p className="text-gray-900">{ledgerAccounts.length}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => onViewDetails(ledger.ledger_id)}
                >
                  View Accounts
                </button>
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800"
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
    </div>
  );
};

export default LedgerList;