import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import PageHeader from '../shared/PageHeader';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

/**
 * Dashboard View component to display a system overview
 */
const DashboardView = ({ entities, ledgers, accounts, onRefresh }) => {
  // Calculate dashboard summary data
  const dashboardSummary = {
    totalAccounts: accounts.length,
    totalLedgers: ledgers.length,
    totalEntities: entities.length,
    totalBalance: accounts.reduce((sum, account) => sum + (account.balance || 0), 0)
  };

  // Accounts by entity data for pie chart
  const accountsByEntityData = () => {
    if (!accounts || accounts.length === 0 || !entities || entities.length === 0) {
      return [];
    }

    const entityCounts = {};
    
    accounts.forEach(account => {
      const entityId = account.entity_id || (account.enriched_ledger && account.enriched_ledger.entity_id);
      if (entityId) {
        entityCounts[entityId] = (entityCounts[entityId] || 0) + 1;
      }
    });
    
    return Object.keys(entityCounts).map(entityId => {
      const entity = entities.find(e => e.entity_id === entityId);
      return {
        name: entity ? entity.name : 'Unknown',
        value: entityCounts[entityId]
      };
    });
  };

  const entityAccountsData = accountsByEntityData();

  return (
    <div>
      <PageHeader 
        title="System Overview" 
        refreshButton={true}
        onRefresh={onRefresh}
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Entities</p>
          <p className="text-2xl font-bold text-blue-600">{dashboardSummary.totalEntities}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Ledgers</p>
          <p className="text-2xl font-bold text-blue-600">{dashboardSummary.totalLedgers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Accounts</p>
          <p className="text-2xl font-bold text-blue-600">{dashboardSummary.totalAccounts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Balance</p>
          <p className="text-2xl font-bold text-green-600">
            {(dashboardSummary.totalBalance / 100).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </p>
        </div>
      </div>
      
      {/* Entity Distribution */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Accounts by Entity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={entityAccountsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {entityAccountsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Accounts']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;