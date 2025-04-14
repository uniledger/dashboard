import React, { useState, useEffect } from 'react';
import PageHeader from '../shared/PageHeader';

// Colors for charts and financial statements
const COLORS = {
  ASSET: '#4299E1',      // Blue
  LIABILITY: '#F56565',  // Red
  EQUITY: '#68D391',     // Green
  REVENUE: '#9F7AEA',    // Purple
  EXPENSE: '#F6AD55',    // Orange
  OTHER: '#CBD5E0'       // Gray
};

/**
 * Dashboard View component to display a system overview with financial statements
 */
const DashboardView = ({ entities, ledgers, accounts, onRefresh }) => {
  const [balanceSheetData, setBalanceSheetData] = useState({
    assets: 0,
    liabilities: 0,
    equity: 0
  });
  
  const [incomeStatementData, setIncomeStatementData] = useState({
    revenue: 0,
    expenses: 0,
    netIncome: 0
  });

  // Calculate dashboard summary data
  const dashboardSummary = {
    totalAccounts: accounts.length,
    totalLedgers: ledgers.length,
    totalEntities: entities.length
  };

  // Process accounts data to create financial statements
  useEffect(() => {
    if (!accounts || accounts.length === 0) return;
    
    let assets = 0;
    let liabilities = 0;
    let equity = 0;
    let revenue = 0;
    let expenses = 0;
    
    accounts.forEach(account => {
      // Get account type (normalize to uppercase)
      let accountType = 'OTHER';
      
      if (account.account_type) {
        accountType = account.account_type.toUpperCase();
      } else if (account.account_code && account.account_code.type) {
        accountType = account.account_code.type.toUpperCase();
      } else if (typeof account.account_code === 'object' && account.account_code.type) {
        accountType = account.account_code.type.toUpperCase();
      }
      
      // Normalize balance (if in cents)
      const balance = account.balance || 0;
      const normalizedBalance = balance > 10000 ? balance / 100 : balance;
      
      // Update financial statement data
      switch (accountType) {
        case 'ASSET':
          assets += normalizedBalance;
          break;
        case 'LIABILITY':
          liabilities += normalizedBalance;
          break;
        case 'EQUITY':
          equity += normalizedBalance;
          break;
        case 'REVENUE':
          revenue += normalizedBalance;
          break;
        case 'EXPENSE':
          expenses += normalizedBalance;
          break;
        default:
          // Other account types
          break;
      }
    });
    
    // Update balance sheet data
    setBalanceSheetData({
      assets,
      liabilities,
      equity
    });
    
    // Update income statement data
    setIncomeStatementData({
      revenue,
      expenses,
      netIncome: revenue - expenses
    });
  }, [accounts]);

  // Format currency for display
  const formatCurrency = (amount) => {
    // Format with commas and no currency code
    const roundedAmount = Math.round(amount);
    const formattedAmount = roundedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    if (roundedAmount < 0) {
      return `(${formattedAmount.replace('-', '')})`;  // Remove minus and add parentheses
    } else {
      return formattedAmount;
    }
  };

  return (
    <div>
      <PageHeader 
        title="Financial Overview" 
        refreshButton={true}
        onRefresh={onRefresh}
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
      </div>
      
      {/* Balance Sheet */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Balance Sheet Summary (GBP)</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-lg font-semibold pb-2">Assets</th>
                  <th className="text-right text-lg pb-2"></th>
                </tr>
              </thead>
              <tbody className="border-t border-gray-200">
                <tr>
                  <td className="py-2 text-gray-700">Total Assets</td>
                  <td className="py-2 text-right font-medium text-gray-900">
                    {formatCurrency(balanceSheetData.assets)}
                  </td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th className="text-left text-lg font-semibold pb-2 pt-4">Liabilities</th>
                  <th className="text-right text-lg pb-2 pt-4"></th>
                </tr>
              </thead>
              <tbody className="border-t border-gray-200">
                <tr>
                  <td className="py-2 text-gray-700">Total Liabilities</td>
                  <td className="py-2 text-right font-medium text-gray-900">
                    {formatCurrency(balanceSheetData.liabilities)}
                  </td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th className="text-left text-lg font-semibold pb-2 pt-4">Equity</th>
                  <th className="text-right text-lg pb-2 pt-4"></th>
                </tr>
              </thead>
              <tbody className="border-t border-gray-200">
                <tr>
                  <td className="py-2 text-gray-700">Total Equity</td>
                  <td className="py-2 text-right font-medium text-gray-900">
                    {formatCurrency(balanceSheetData.equity)}
                  </td>
                </tr>
                <tr className="border-t-2 border-gray-300">
                  <td className="py-2 font-bold">Total Liabilities & Equity</td>
                  <td className="py-2 text-right font-bold">
                    {formatCurrency(balanceSheetData.liabilities + balanceSheetData.equity)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Income Statement */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Income Statement Summary (GBP)</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-lg font-semibold pb-2">Revenue</th>
                  <th className="text-right text-lg pb-2"></th>
                </tr>
              </thead>
              <tbody className="border-t border-gray-200">
                <tr>
                  <td className="py-2 text-gray-700">Total Revenue</td>
                  <td className="py-2 text-right font-medium text-gray-900">
                    {formatCurrency(incomeStatementData.revenue)}
                  </td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th className="text-left text-lg font-semibold pb-2 pt-4">Expenses</th>
                  <th className="text-right text-lg pb-2 pt-4"></th>
                </tr>
              </thead>
              <tbody className="border-t border-gray-200">
                <tr>
                  <td className="py-2 text-gray-700">Total Expenses</td>
                  <td className="py-2 text-right font-medium text-gray-900">
                    {formatCurrency(incomeStatementData.expenses)}
                  </td>
                </tr>
                <tr className="border-t-2 border-gray-300">
                  <td className="py-2 font-bold">Net Income</td>
                  <td className={`py-2 text-right font-bold ${incomeStatementData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(incomeStatementData.netIncome)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      

    </div>
  );
};

export default DashboardView;