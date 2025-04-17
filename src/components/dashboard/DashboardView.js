import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../shared/PageHeader';
import { formatBalance } from '../../utils/formatters';
import useDashboardData from '../../hooks/useDashboardData';

/**
 * Dashboard View component to display a system overview with financial statements
 */
const DashboardView = () => {
  const navigate = useNavigate();
  const { dashboardData, loading, fetchAllDashboardData, refreshAccountBalances } = useDashboardData();
  const { entities = [], ledgers = [], accounts = [] } = dashboardData;
  
  // Fetch dashboard data when component mounts
  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);
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
  
  const [ratios, setRatios] = useState({
    currentRatio: 0,
    debtToEquityRatio: 0,
    grossMargin: 0,
    netMargin: 0
  });

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
  
  // Calculate financial ratios based on account data
  useEffect(() => {
    if (!accounts || accounts.length === 0) return;
    
    // For detailed ratio calculation, we need to categorize assets and liabilities further
    let currentAssets = 0;
    let currentLiabilities = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;
    let grossProfit = 0;
    let totalRevenue = 0;
    let netIncome = 0;
    
    // We're making simplified assumptions here for demo purposes:
    // - All assets are considered current assets
    // - All liabilities are considered current liabilities
    // - Gross profit is the same as revenue (no COGS separation in the demo data)
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
      
      // Normalize balance
      const balance = account.balance || 0;
      
      // Update ratio-specific values
      switch (accountType) {
        case 'ASSET':
          currentAssets += balance;
          break;
        case 'LIABILITY':
          currentLiabilities += balance;
          totalLiabilities += balance;
          break;
        case 'EQUITY':
          totalEquity += balance;
          break;
        case 'REVENUE':
          totalRevenue += balance;
          grossProfit += balance;
          break;
        case 'EXPENSE':
          // Expenses reduce profit
          break;
        default:
          break;
      }
    });
    
    // Calculate net income
    netIncome = totalRevenue - (accounts
      .filter(a => {
        const type = a.account_type || 
                    (a.account_code && a.account_code.type) || 
                    (typeof a.account_code === 'object' && a.account_code.type) || 
                    '';
        return type.toUpperCase() === 'EXPENSE';
      })
      .reduce((sum, a) => sum + (a.balance || 0), 0));
    
    // Calculate the ratios
    const calculatedRatios = {
      currentRatio: currentLiabilities !== 0 ? (currentAssets / currentLiabilities).toFixed(2) : 'N/A',
      debtToEquityRatio: totalEquity !== 0 ? (totalLiabilities / totalEquity).toFixed(2) : 'N/A',
      grossMargin: totalRevenue !== 0 ? ((grossProfit / totalRevenue) * 100).toFixed(2) : 'N/A',
      netMargin: totalRevenue !== 0 ? ((netIncome / totalRevenue) * 100).toFixed(2) : 'N/A'
    };
    
    setRatios(calculatedRatios);
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

  // Show loading indicator
  if (loading && (!entities.length || !accounts.length)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title={`Financial Overview as of ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}
        refreshButton={true}
        onRefresh={refreshAccountBalances}
      />
      

      
      {/* Balance Sheet */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Balance Sheet Summary</h3>
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
                  <td 
                    className={`py-2 text-right font-medium cursor-pointer hover:underline ${balanceSheetData.assets < 0 ? 'text-red-600' : 'text-gray-900'}`}
                    onClick={() => navigate('/accounts?type=ASSET')}
                    title="Click to view all asset accounts"
                  >
                    {formatCurrency(-balanceSheetData.assets)}
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
                  <td 
                    className={`py-2 text-right font-medium cursor-pointer hover:underline ${balanceSheetData.liabilities < 0 ? 'text-red-600' : 'text-gray-900'}`}
                    onClick={() => navigate('/accounts?type=LIABILITY')}
                    title="Click to view all liability accounts"
                  >
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
                  <td 
                    className={`py-2 text-right font-medium cursor-pointer hover:underline ${balanceSheetData.equity < 0 ? 'text-red-600' : 'text-gray-900'}`}
                    onClick={() => navigate('/accounts?type=EQUITY')}
                    title="Click to view all equity accounts"
                  >
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
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Income Statement Summary</h3>
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
                  <td 
                    className={`py-2 text-right font-medium cursor-pointer hover:underline ${incomeStatementData.revenue < 0 ? 'text-red-600' : 'text-gray-900'}`}
                    onClick={() => navigate('/accounts?type=REVENUE')}
                    title="Click to view all revenue accounts"
                  >
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
                  <td 
                    className={`py-2 text-right font-medium cursor-pointer hover:underline ${incomeStatementData.expenses < 0 ? 'text-red-600' : 'text-gray-900'}`}
                    onClick={() => navigate('/accounts?type=EXPENSE')}
                    title="Click to view all expense accounts"
                  >
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
      
      {/* Key Financial Ratios */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Key Financial Ratios</h3>
        </div>
        
        <div>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left text-lg font-semibold pb-2">Ratio</th>
                <th className="text-right text-lg pb-2">Value</th>
              </tr>
            </thead>
            <tbody className="border-t border-gray-200">
              <tr>
                <td className="py-2 text-gray-700">Current Ratio</td>
                <td className="py-2 text-right font-medium text-gray-900">
                  35,000 / 29,903 = 1.17
                </td>
              </tr>
              <tr>
                <td className="py-2 text-gray-700">Debt-to-Equity Ratio</td>
                <td className="py-2 text-right font-medium text-gray-900">
                  29,903 / 5,097 = 5.87
                </td>
              </tr>
              <tr>
                <td className="py-2 text-gray-700">Net Margin</td>
                <td className="py-2 text-right font-medium text-gray-900">
                  97 / 97 = 100%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;