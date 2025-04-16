import React, { useState, useEffect } from 'react';
import PageHeader from '../shared/PageHeader';
import { fetchAccountCodes } from '../../utils/apiService';

/**
 * Account Codes List component to display all available account codes
 */
const AccountCodesList = ({ onViewJson, onRefresh }) => {
  const [accountCodes, setAccountCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAccountCodes = async () => {
      setLoading(true);
      try {
        const data = await fetchAccountCodes();
        setAccountCodes(data);
        setError(null);
      } catch (err) {
        console.error('Error loading account codes:', err);
        setError('Failed to load account codes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAccountCodes();
  }, []);

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      setLoading(true);
      try {
        const data = await fetchAccountCodes();
        setAccountCodes(data);
        setError(null);
      } catch (err) {
        console.error('Error refreshing account codes:', err);
        setError('Failed to refresh account codes. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <PageHeader 
        title="Reference Data" 
        refreshButton={true}
        onRefresh={handleRefresh}
      />
      
      {error && (
        <div className="bg-red-100 p-4 mb-6 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : accountCodes && accountCodes.length > 0 ? accountCodes.map((code) => (
              <tr key={code.id || code.account_code} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {code.account_code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {code.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {code.type || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {code.description || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <button 
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => onViewJson && onViewJson(code, `Account Code: ${code.account_code}`)}
                  >
                    JSON
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No account codes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountCodesList;