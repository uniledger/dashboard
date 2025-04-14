import React, { useState, useEffect } from 'react';
import PageHeader from '../shared/PageHeader';

/**
 * Dashboard View component to display a system overview with financial statements
 */
const DashboardView = ({ entities, ledgers, accounts, onRefresh }) => {
  const [balanceSheetData, setBalanceSheetData] = useState({
    assets: 0,
    liabilities: 0,
    equity: 0,
    retainedEarnings: 0
  });
  
  const [incomeStatementData, setIncomeStatementData] = useState({
    revenue: 0,
    expenses: 0,
    netIncome: 0
  });

  // We removed dashboard summary counts since they're not needed

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
      let normalizedBalance = balance;
      
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
    
    // Calculate net income
    const netIncome = revenue - expenses;
    
    // Update balance sheet data (include net income in equity)
    setBalanceSheetData({
      assets: assets / 1000,
      liabilities: liabilities / 1000,
      equity: equity / 1000,
      retainedEarnings: netIncome / 1000  // Include net income as retained earnings
    });
    
    // Update income statement data
    setIncomeStatementData({
      revenue: revenue / 1000,
      expenses: expenses / 1000,
      netIncome: netIncome / 1000
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

  // Calculate total equity including retained earnings
  const totalEquity = balanceSheetData.equity + balanceSheetData.retainedEarnings;

  return (
    <div>
      <PageHeader 
        title={`Financial Overview as of ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}
        refreshButton={true}
        onRefresh={onRefresh}
      />
      
      {/* Balance Sheet */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Balance Sheet Summary (GBP)</h3>
          <div className="text-right text-sm text-gray-500">
            <div>Values in thousands (GBP)</div>
          </div>
        </div>
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
                  <td className={`py-2 text-right font-medium ${balanceSheetData.assets < 0 ? 'text-red-600' : 'text-gray-900'}`}>
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
                  <td className={`py-2 text-right font-medium ${balanceSheetData.liabilities < 0 ? 'text-red-600' : 'text-gray-900'}`}>
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
                  <td className="py-2 text-gray-700">Contributed Capital</td>
                  <td className={`py-2 text-right font-medium ${balanceSheetData.equity < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatCurrency(balanceSheetData.equity)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-700">Retained Earnings</td>
                  <td className={`py-2 text-right font-medium ${balanceSheetData.retainedEarnings < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatCurrency(balanceSheetData.retainedEarnings)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-700">Total Equity</td>
                  <td className={`py-2 text-right font-medium ${totalEquity < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatCurrency(totalEquity)}
                  </td>
                </tr>
                <tr className="border-t-2 border-gray-300">
                  <td className="py-2 font-bold">Total Liabilities & Equity</td>
                  <td className={`py-2 text-right font-bold ${(balanceSheetData.liabilities + totalEquity) < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatCurrency(balanceSheetData.liabilities + totalEquity)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Income Statement */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Income Statement Summary (GBP)</h3>
          <div className="text-right text-sm text-gray-500">
            <div>Values in thousands (GBP)</div>
          </div>
        </div>
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
                  <td className={`py-2 text-right font-medium ${incomeStatementData.revenue < 0 ? 'text-red-600' : 'text-gray-900'}`}>
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
                  <td className={`py-2 text-right font-medium ${incomeStatementData.expenses < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatCurrency(incomeStatementData.expenses)}
                  </td>
                </tr>
                <tr className="border-t-2 border-gray-300">
                  <td className="py-2 font-bold">Net Income</td>
                  <td className={`py-2 text-right font-bold ${incomeStatementData.netIncome < 0 ? 'text-red-600' : 'text-gray-900'}`}>
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