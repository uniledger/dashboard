import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import DetailModal from './shared/DetailModal';

const API_BASE_URL = 'https://ledger.dev.ledgerrocket.com';

const LedgerDashboard = () => {
  const [activeTab, setActiveTab] = useState('accounts');
  const [accounts, setAccounts] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accountTypeData, setAccountTypeData] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch actual data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch enriched accounts
        const accountsResponse = await axios.get(`${API_BASE_URL}/api/v1/enriched-accounts/`);
        setAccounts(accountsResponse.data);
        
        // Fetch enriched ledgers
        const ledgersResponse = await axios.get(`${API_BASE_URL}/api/v1/enriched-ledgers/`);
        setLedgers(ledgersResponse.data);
        
        // Calculate account type data from real accounts
        const typeData = calculateAccountTypeData(accountsResponse.data);
        setAccountTypeData(typeData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to view JSON data
  const handleViewJson = (data, title) => {
    setModalData(data);
    setModalTitle(title);
    setModalOpen(true);
  };

  // Calculate account types from real data
  const calculateAccountTypeData = (accountsData) => {
    if (!accountsData || accountsData.length === 0) {
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
    
    accountsData.forEach(account => {
      const type = account.account_code && account.account_code.type 
        ? typeMap[account.account_code.type] || account.account_code.type
        : 'Unknown';
      
      typeBalances[type] = (typeBalances[type] || 0) + (account.balance || 0);
    });
    
    return Object.keys(typeBalances).map(type => ({
      type,
      value: typeBalances[type]
    }));
  };

  // Generate colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading ledger data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center text-red-500">
          <p>Error loading data: {error}</p>
          <button 
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">LedgerRocket Banking API Demo</h1>
            <div className="flex space-x-4">
              <a 
                href="https://ledger.dev.ledgerrocket.com/openapi.json" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                API Documentation
              </a>
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Get API Key
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('accounts')}
              className={`pb-3 px-1 ${activeTab === 'accounts' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Accounts
            </button>
            <button
              onClick={() => setActiveTab('ledgers')}
              className={`pb-3 px-1 ${activeTab === 'ledgers' 
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Ledgers
            </button>
            {accountTypeData.length > 0 && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`pb-3 px-1 ${activeTab === 'analytics' 
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Analytics
              </button>
            )}
          </nav>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'accounts' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Accounts Overview</h2>
              <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                + New Account
              </button>
            </div>
            
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ledger
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accounts && accounts.length > 0 ? accounts.map((account) => (
                    <tr key={account.account_extra_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.account_extra_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {account.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.account_code?.code || account.code || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.account_code?.type || account.type || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.enriched_ledger?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {account.enriched_ledger?.r_currency?.currency_code || ''} {' '}
                        {typeof account.balance === 'number' 
                          ? (account.balance / Math.pow(10, account.enriched_ledger?.r_currency?.scale || 2)).toLocaleString()
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">
                          View
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800 mr-2"
                          onClick={() => handleViewJson(account, `Account: ${account.name}`)}
                        >
                          JSON
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          Transactions
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No accounts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ledgers' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Ledgers</h2>
              <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                + New Ledger
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ledgers && ledgers.length > 0 ? ledgers.map((ledger) => (
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
                      <p className="text-gray-900">{ledger.r_entity?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Currency</p>
                      <p className="text-gray-900">{ledger.r_currency?.currency_code || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Manage Accounts
                    </button>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      View Transactions
                    </button>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => handleViewJson(ledger, `Ledger: ${ledger.name}`)}
                    >
                      View JSON
                    </button>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center p-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">No ledgers found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && accountTypeData.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Accounts Analysis</h2>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Type Breakdown</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={accountTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="type"
                      >
                        {accountTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => value.toLocaleString()} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={accountTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip formatter={(value) => value.toLocaleString()} />
                      <Legend />
                      <Bar dataKey="value" name="Balance" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 LedgerRocket. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="/documentation" className="text-gray-500 hover:text-gray-700 text-sm">Documentation</a>
              <a href="/api-reference" className="text-gray-500 hover:text-gray-700 text-sm">API Reference</a>
              <a href="/support" className="text-gray-500 hover:text-gray-700 text-sm">Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Detail Modal for JSON viewing */}
      <DetailModal
        isOpen={modalOpen}
        data={modalData}
        title={modalTitle}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default LedgerDashboard;