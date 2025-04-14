import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PageHeader from '../shared/PageHeader';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

/**
 * Analytics View component to display financial analytics
 * with refresh capability
 */
const AnalyticsView = ({ accounts, entities, onRefresh }) => {
  // Calculate account type breakdown data
  const calculateAccountTypeData = () => {
    if (!accounts || accounts.length === 0) {
      return [];
    }

    const typeMap = {
      'ASSET': 'Assets',
      'LIABILITY': 'Liabilities',
      'EQUITY': 'Equity',
      'REVENUE': 'Revenue',
      'EXPENSE': 'Expenses',
      'CONTINGENT': 'Contingent',
      'MEMO': 'Memo'
    };
    
    const typeBalances = {};
    
    accounts.forEach(account => {
      let type = 'Unknown';
      
      // Extract account type from different possible locations in data structure
      if (account.account_code) {
        if (typeof account.account_code === 'object' && account.account_code.type) {
          type = typeMap[account.account_code.type] || account.account_code.type;
        } else {
          type = account.account_code;
        }
      } else if (account.account_type) {
        type = typeMap[account.account_type] || account.account_type;
      } else if (account.type) {
        type = typeMap[account.type] || account.type;
      }
      
      typeBalances[type] = (typeBalances[type] || 0) + (account.balance || 0);
    });
    
    return Object.keys(typeBalances).map(type => ({
      type,
      value: typeBalances[type] / 100 // Convert cents to dollars for better visualization
    }));
  };

  // Accounts by entity data for pie chart
  const accountsByEntityData = () => {
    if (!accounts || accounts.length === 0 || !entities || entities.length === 0) {
      return [];
    }

    const entityCounts = {};
    
    accounts.forEach(account => {
      const entityId = account.entity_id || 
        (account.enriched_ledger && account.enriched_ledger.entity_id) ||
        (account.entity && account.entity.entity_id);
        
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

  const accountTypeData = calculateAccountTypeData();
  const entityAccountsData = accountsByEntityData();

  return (
    <div>
      <PageHeader 
        title="Financial Analytics" 
        refreshButton={true}
        onRefresh={onRefresh}
      />
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Type Breakdown</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={accountTypeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis 
              tickFormatter={(value) => 
                value.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })
              } 
            />
            <Tooltip 
              formatter={(value) => [
                value.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }), 
                'Amount'
              ]} 
            />
            <Legend />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Accounts Distribution by Entity</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={entityAccountsData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={160}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {entityAccountsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, 'Accounts']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsView;