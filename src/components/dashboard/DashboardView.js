import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../shared/PageHeader';
import useDashboardData from '../../hooks/useDashboardData';

/**
 * Dashboard View component to display a system overview with financial statements
 */
const DashboardView = () => {
  const navigate = useNavigate();
  const { dashboardData, loading, fetchAllDashboardData, refreshAccountBalances } = useDashboardData();
  const { entities = [], accounts = [], ledgers = [] } = dashboardData;
  const [selectedLedgerId, setSelectedLedgerId] = useState('');
  // Set default selected ledger on load
  useEffect(() => {
    if (!selectedLedgerId && ledgers.length > 0) {
      setSelectedLedgerId(String(ledgers[0].ledger_id));
    }
  }, [ledgers, selectedLedgerId]);
  // Filter accounts by selected ledger ID (in-memory)
  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      const accLedgerId = account.ledger_id || (account.enriched_ledger && account.enriched_ledger.ledger_id);
      return String(accLedgerId) === String(selectedLedgerId);
    });
  }, [accounts, selectedLedgerId]);
  // Determine selected ledger and its currency
  const selectedLedger = ledgers.find(l => String(l.ledger_id) === String(selectedLedgerId));
  const currencyCode = selectedLedger?.r_currency?.currency_code || selectedLedger?.currency_code || '';
  
  // Treeview state for Assets section
  const [assetExpanded, setAssetExpanded] = useState(false);
  const [liabilityExpanded, setLiabilityExpanded] = useState(false);
  const [revenueExpanded, setRevenueExpanded] = useState(false);
  const [expenseExpanded, setExpenseExpanded] = useState(false);
  
  // Helper to determine account type
  const getAccountType = (account) => {
    if (account.account_type) return account.account_type.toUpperCase();
    if (account.account_code && account.account_code.type) return account.account_code.type.toUpperCase();
    if (typeof account.account_code === 'object' && account.account_code.type) return account.account_code.type.toUpperCase();
    return 'OTHER';
  };
  
  // Helper to compute decimal balance
  const getDecimalBalance = (account) => {
    const rawBalance = typeof account.balance === 'number' ? account.balance : 0;
    const DEFAULT_SCALE = 2;
    let scale = DEFAULT_SCALE;
    if (account.r_currency && typeof account.r_currency.scale === 'number') {
      scale = account.r_currency.scale;
    } else if (account.currency && typeof account.currency.scale === 'number') {
      scale = account.currency.scale;
    } else if (account.ledger && account.ledger.r_currency && typeof account.ledger.r_currency.scale === 'number') {
      scale = account.ledger.r_currency.scale;
    } else if (account.enriched_ledger && account.enriched_ledger.r_currency && typeof account.enriched_ledger.r_currency.scale === 'number') {
      scale = account.enriched_ledger.r_currency.scale;
    }
    return rawBalance / Math.pow(10, scale);
  };
  
  // Prepare asset accounts with balances in thousands
  const assetAccounts = filteredAccounts
    .filter((account) => getAccountType(account) === 'ASSET')
    .map((account) => {
      const decimalBalance = getDecimalBalance(account);
      const thousandsBalance = decimalBalance / 1000;
      return { account, balance: thousandsBalance };
    });
  const liabilityAccounts = filteredAccounts
    .filter((account) => getAccountType(account) === 'LIABILITY')
    .map((account) => {
      const decimalBalance = getDecimalBalance(account);
      const thousandsBalance = decimalBalance / 1000;
      return { account, balance: thousandsBalance };
    });
  const revenueAccounts = filteredAccounts
    .filter((account) => getAccountType(account) === 'REVENUE')
    .map((account) => {
      const decimalBalance = getDecimalBalance(account);
      const thousandsBalance = decimalBalance / 1000;
      return { account, balance: thousandsBalance };
    });
  const expenseAccounts = filteredAccounts
    .filter((account) => getAccountType(account) === 'EXPENSE')
    .map((account) => {
      const decimalBalance = getDecimalBalance(account);
      const thousandsBalance = decimalBalance / 1000;
      return { account, balance: thousandsBalance };
    });

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
    if (!Array.isArray(filteredAccounts)) {
      return;
    }

    if (!filteredAccounts || filteredAccounts.length === 0) return;
    
    let assets = 0;
    let liabilities = 0;
    let equity = 0;
    let revenue = 0;
    let expenses = 0;
    
    // Default currency scale (2 for GBP/USD, etc.)
    const currencyScale = 2;
    
    filteredAccounts.forEach(account => {
      // Get account type (normalize to uppercase)
      let accountType = 'OTHER';
      
      if (account.account_type) {
        accountType = account.account_type.toUpperCase();
      } else if (account.account_code && account.account_code.type) {
        accountType = account.account_code.type.toUpperCase();
      } else if (typeof account.account_code === 'object' && account.account_code.type) {
        accountType = account.account_code.type.toUpperCase();
      }
      
      // Get the account's raw balance - ensure it's a number
      const rawBalance = typeof account.balance === 'number' ? account.balance : 0;
      
      // Determine currency scale for this account
      let scale = currencyScale;
      if (account.r_currency && typeof account.r_currency.scale === 'number') {
        scale = account.r_currency.scale;
      } else if (account.currency && typeof account.currency.scale === 'number') {
        scale = account.currency.scale;
      } else if (account.ledger && account.ledger.r_currency && typeof account.ledger.r_currency.scale === 'number') {
        scale = account.ledger.r_currency.scale;
      } else if (account.enriched_ledger && account.enriched_ledger.r_currency && 
                typeof account.enriched_ledger.r_currency.scale === 'number') {
        scale = account.enriched_ledger.r_currency.scale;
      }
      
      // Convert raw integer balance to decimal value
      const decimalBalance = rawBalance / Math.pow(10, scale);
      
      // Update financial statement data
      switch (accountType) {
        case 'ASSET':
          assets += decimalBalance;
          break;
        case 'LIABILITY':
          liabilities += decimalBalance;
          break;
        case 'EQUITY':
          equity += decimalBalance;
          break;
        case 'REVENUE':
          revenue += decimalBalance;
          break;
        case 'EXPENSE':
          expenses += decimalBalance;
          break;
        default:
          // Other account types
          break;
      }
    });
    
    // Calculate net income
    const netIncome = revenue - expenses;
    
    // Values are already in decimal form, convert to thousands for display
    // For example, if assets = 1,000,000.00, we want to show 1,000 (thousands)
    setBalanceSheetData({
      assets: assets / 1000,
      liabilities: liabilities / 1000,
      equity: equity / 1000,
      retainedEarnings: netIncome / 1000  // Include net income as retained earnings
    });
    
    // Update income statement data (also in thousands)
    setIncomeStatementData({
      revenue: revenue / 1000,
      expenses: expenses / 1000,
      netIncome: netIncome / 1000
    });
  }, [filteredAccounts]);
  
  // Calculate financial ratios based on account data
  useEffect(() => {
    if (!Array.isArray(filteredAccounts)) {
      return;
    }

    if (!filteredAccounts || filteredAccounts.length === 0) return;
    
    // For detailed ratio calculation, we need to categorize assets and liabilities further
    let currentAssets = 0;
    let currentLiabilities = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;
    let totalRevenue = 0;
    let netIncome = 0;
    
    // Default currency scale (2 for GBP/USD, etc.)
    const currencyScale = 2;
    
    // We're making simplified assumptions here for demo purposes:
    // - All assets are considered current assets
    // - All liabilities are considered current liabilities
    // - Gross profit is the same as revenue (no COGS separation in the demo data)
    filteredAccounts.forEach(account => {
      // Get account type (normalize to uppercase)
      let accountType = 'OTHER';
      
      if (account.account_type) {
        accountType = account.account_type.toUpperCase();
      } else if (account.account_code && account.account_code.type) {
        accountType = account.account_code.type.toUpperCase();
      } else if (typeof account.account_code === 'object' && account.account_code.type) {
        accountType = account.account_code.type.toUpperCase();
      }
      
      // Get the account's raw balance
      const rawBalance = account.balance || 0;
      
      // Determine currency scale for this account
      let scale = currencyScale;
      if (account.r_currency && typeof account.r_currency.scale === 'number') {
        scale = account.r_currency.scale;
      } else if (account.currency && typeof account.currency.scale === 'number') {
        scale = account.currency.scale;
      } else if (account.ledger && account.ledger.r_currency && typeof account.ledger.r_currency.scale === 'number') {
        scale = account.ledger.r_currency.scale;
      } else if (account.enriched_ledger && account.enriched_ledger.r_currency && 
                typeof account.enriched_ledger.r_currency.scale === 'number') {
        scale = account.enriched_ledger.r_currency.scale;
      }
      
      // Convert raw integer balance to decimal value
      const decimalBalance = rawBalance / Math.pow(10, scale);
      
      // Update ratio-specific values
      switch (accountType) {
        case 'ASSET':
          currentAssets += decimalBalance;
          break;
        case 'LIABILITY':
          currentLiabilities += decimalBalance;
          totalLiabilities += decimalBalance;
          break;
        case 'EQUITY':
          totalEquity += decimalBalance;
          break;
        case 'REVENUE':
          totalRevenue += decimalBalance;
          break;
        case 'EXPENSE':
          // Expenses reduce profit
          break;
        default:
          break;
      }
    });
    
    // Calculate net income from expense accounts
    const totalExpenses = filteredAccounts
      .filter(a => {
        const type = a.account_type || 
                    (a.account_code && a.account_code.type) || 
                    (typeof a.account_code === 'object' && a.account_code.type) || 
                    '';
        return type.toUpperCase() === 'EXPENSE';
      })
      .reduce((sum, a) => {
        // Get currency scale
        let scale = currencyScale;
        if (a.r_currency && typeof a.r_currency.scale === 'number') {
          scale = a.r_currency.scale;
        } else if (a.currency && typeof a.currency.scale === 'number') {
          scale = a.currency.scale;
        } else if (a.ledger && a.ledger.r_currency && typeof a.ledger.r_currency.scale === 'number') {
          scale = a.ledger.r_currency.scale;
        } else if (a.enriched_ledger && a.enriched_ledger.r_currency && 
                  typeof a.enriched_ledger.r_currency.scale === 'number') {
          scale = a.enriched_ledger.r_currency.scale;
        }
        
        // Convert to decimal and add to sum
        return sum + ((a.balance || 0) / Math.pow(10, scale));
      }, 0);
    
    netIncome = totalRevenue - totalExpenses;
    
    // Calculate the ratios
    const calculatedRatios = {
      currentRatio: currentLiabilities !== 0 ? (currentAssets / currentLiabilities).toFixed(2) : 'N/A',
      debtToEquityRatio: totalEquity !== 0 ? (totalLiabilities / totalEquity).toFixed(2) : 'N/A',

      netMargin: totalRevenue !== 0 ? ((netIncome / totalRevenue) * 100).toFixed(2) : 'N/A'
    };
    
    setRatios(calculatedRatios);
  }, [filteredAccounts]);

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
    <div className="mx-2 md:mx-6 lg:mx-8">
      <PageHeader
        title={`Financial Overview as of ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}
        refreshButton={true}
        onRefresh={refreshAccountBalances}
      >
        <div className="ml-4">
          <select
            aria-label="Ledger"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
            value={selectedLedgerId}
            onChange={e => setSelectedLedgerId(e.target.value)}
          >
            {ledgers.map(ledger => (
              <option key={ledger.ledger_id} value={ledger.ledger_id}>
                {ledger.name} (ID: {ledger.ledger_id})
              </option>
            ))}
          </select>
        </div>
      </PageHeader>
      
      {/* Financial Statements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Balance Sheet */}
        <div className="bg-white p-4 rounded-lg shadow transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Balance Sheet Summary</h3>
          <div className="text-right text-sm text-gray-500">
            <div>Values in thousands ({currencyCode})</div>
          </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th
                    className="text-left text-lg font-semibold pb-2 cursor-pointer flex items-center"
                    onClick={() => setAssetExpanded(!assetExpanded)}
                  >
                    {assetExpanded ? (
                      <ChevronDown className="inline-block mr-2" />
                    ) : (
                      <ChevronRight className="inline-block mr-2" />
                    )}
                    Assets
                  </th>
                  <th className="text-right text-lg pb-2"></th>
                </tr>
              </thead>
              <tbody className="border-t border-gray-200">
                <tr>
                  <td className="py-2 text-gray-700">Total Assets</td>
                  <td
                    className={`py-2 text-right font-medium cursor-pointer hover:underline ${balanceSheetData.assets < 0 ? 'text-red-600' : 'text-gray-900'}`}
                    onClick={() => navigate(`/accounts?type=ASSET&ledgerId=${selectedLedgerId}`)}
                    title="Click to view asset accounts for the selected ledger"
                  >
                    {formatCurrency(-balanceSheetData.assets)}
                  </td>
                </tr>
                {assetExpanded &&
                  assetAccounts.map(({ account, balance }) => (
                    <tr key={account.account_id || account.account_extra_id} className="bg-gray-50">
                      <td
                        className="py-2 text-gray-700 pl-6 cursor-pointer hover:underline"
                        onClick={() => navigate(
                          `/accounts/${account.account_extra_id}`
                        )}
                        title="Click to view account details"
                      >
                        {account.name}
                      </td>
                      <td className="py-2 text-right text-gray-900">
                        {formatCurrency(-balance)}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <thead>
                <tr>
                  <th
                    className="text-left text-lg font-semibold pb-2 pt-4 cursor-pointer flex items-center"
                    onClick={() => setLiabilityExpanded(!liabilityExpanded)}
                  >
                    {liabilityExpanded ? (
                      <ChevronDown className="inline-block mr-2" />
                    ) : (
                      <ChevronRight className="inline-block mr-2" />
                    )}
                    Liabilities
                  </th>
                  <th className="text-right text-lg pb-2 pt-4"></th>
                </tr>
              </thead>
              <tbody className="border-t border-gray-200">
                <tr>
                  <td className="py-2 text-gray-700">Total Liabilities</td>
                  <td
                    className={`py-2 text-right font-medium cursor-pointer hover:underline ${balanceSheetData.liabilities < 0 ? 'text-red-600' : 'text-gray-900'}`}
                    onClick={() => navigate(`/accounts?type=LIABILITY&ledgerId=${selectedLedgerId}`)}
                    title="Click to view liability accounts for the selected ledger"
                  >
                    {formatCurrency(balanceSheetData.liabilities)}
                  </td>
                </tr>
                {liabilityExpanded &&
                  liabilityAccounts.map(({ account, balance }) => (
                    <tr key={account.account_id || account.account_extra_id} className="bg-gray-50">
                      <td
                        className="py-2 text-gray-700 pl-6 cursor-pointer hover:underline"
                        onClick={() => navigate(
                          `/accounts/${account.account_id || account.account_extra_id}`
                        )}
                        title="Click to view account details"
                      >
                        {account.name}
                      </td>
                      <td className="py-2 text-right text-gray-900">
                        {formatCurrency(balance)}
                      </td>
                    </tr>
                  ))}
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
                    onClick={() => navigate(`/accounts?type=EQUITY&ledgerId=${selectedLedgerId}`)}
                    title="Click to view equity accounts for the selected ledger"
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
        
        {/* Income Statement */}
        <div className="bg-white p-4 rounded-lg shadow transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Income Statement Summary</h3>
            <div className="text-right text-sm text-gray-500">
              <div>Values in thousands (GBP)</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th
                    className="text-left text-lg font-semibold pb-2 cursor-pointer flex items-center"
                    onClick={() => setRevenueExpanded(!revenueExpanded)}
                  >
                    {revenueExpanded ? (
                      <ChevronDown className="inline-block mr-2" />
                    ) : (
                      <ChevronRight className="inline-block mr-2" />
                    )}
                    Revenue
                  </th>
                  <th className="text-right text-lg pb-2"></th>
                </tr>
              </thead>
              <tbody className="border-t border-gray-200">
                <tr>
                  <td className="py-2 text-gray-700">Total Revenue</td>
                  <td
                    className={`py-2 text-right font-medium cursor-pointer hover:underline ${incomeStatementData.revenue < 0 ? 'text-red-600' : 'text-gray-900'}`}
                    onClick={() => navigate(`/accounts?type=REVENUE&ledgerId=${selectedLedgerId}`)}
                    title="Click to view revenue accounts for the selected ledger"
                  >
                    {formatCurrency(incomeStatementData.revenue)}
                  </td>
                </tr>
                {revenueExpanded &&
                  revenueAccounts.map(({ account, balance }) => (
                    <tr key={account.account_id || account.account_extra_id} className="bg-gray-50">
                      <td
                        className="py-2 text-gray-700 pl-6 cursor-pointer hover:underline"
                        onClick={() => navigate(
                          `/accounts/${account.account_id || account.account_extra_id}`
                        )}
                        title="Click to view account details"
                      >
                        {account.name}
                      </td>
                      <td className="py-2 text-right text-gray-900">
                        {formatCurrency(balance)}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <thead>
                <tr>
                  <th
                    className="text-left text-lg font-semibold pb-2 pt-4 cursor-pointer flex items-center"
                    onClick={() => setExpenseExpanded(!expenseExpanded)}
                  >
                    {expenseExpanded ? (
                      <ChevronDown className="inline-block mr-2" />
                    ) : (
                      <ChevronRight className="inline-block mr-2" />
                    )}
                    Expenses
                  </th>
                  <th className="text-right text-lg pb-2 pt-4"></th>
                </tr>
              </thead>
              <tbody className="border-t border-gray-200">
                <tr>
                  <td className="py-2 text-gray-700">Total Expenses</td>
                  <td
                    className={`py-2 text-right font-medium cursor-pointer hover:underline ${incomeStatementData.expenses < 0 ? 'text-red-600' : 'text-gray-900'}`}
                    onClick={() => navigate(`/accounts?type=EXPENSE&ledgerId=${selectedLedgerId}`)}
                    title="Click to view expense accounts for the selected ledger"
                  >
                    {formatCurrency(incomeStatementData.expenses)}
                  </td>
                </tr>
                {expenseExpanded &&
                  expenseAccounts.map(({ account, balance }) => (
                    <tr key={account.account_id || account.account_extra_id} className="bg-gray-50">
                      <td
                        className="py-2 text-gray-700 pl-6 cursor-pointer hover:underline"
                        onClick={() => navigate(
                          `/accounts/${account.account_id || account.account_extra_id}`
                        )}
                        title="Click to view account details"
                      >
                        {account.name}
                      </td>
                      <td className="py-2 text-right text-gray-900">
                        {formatCurrency(balance)}
                      </td>
                    </tr>
                  ))}
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
      <div className="bg-white p-4 rounded-lg shadow transition-all hover:shadow-md mb-6">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Key Financial Ratios</h3>
        </div>
        
        <div className="overflow-x-auto">
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
                  {typeof ratios.currentRatio === 'number' ? ratios.currentRatio : ratios.currentRatio}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-gray-700">Debt-to-Equity Ratio</td>
                <td className="py-2 text-right font-medium text-gray-900">
                  {typeof ratios.debtToEquityRatio === 'number' ? ratios.debtToEquityRatio : ratios.debtToEquityRatio}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-gray-700">Net Margin</td>
                <td className="py-2 text-right font-medium text-gray-900">
                  {typeof ratios.netMargin === 'number' ? `${ratios.netMargin}%` : ratios.netMargin}
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