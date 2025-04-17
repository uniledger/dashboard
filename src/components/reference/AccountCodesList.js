import React, { useState, useEffect } from 'react';
import { GenericListView } from '../common';
import apiService from '../../services/apiService';

/**
 * Account Codes List component using GenericListView
 */
const AccountCodesList = ({ onViewJson, onRefresh }) => {
  const [accountCodes, setAccountCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define columns for the DataTable
  const columns = [
    {
      key: 'account_code',
      header: 'Code',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      key: 'name',
      header: 'Name',
      cellClassName: 'text-gray-500',
      render: (code) => code.name || 'N/A'
    },
    {
      key: 'type',
      header: 'Type',
      cellClassName: 'text-gray-500',
      render: (code) => code.type || 'N/A'
    },
    {
      key: 'description',
      header: 'Description',
      cellClassName: 'text-gray-500',
      render: (code) => code.description || 'N/A'
    }
  ];

  useEffect(() => {
    const loadAccountCodes = async () => {
      setLoading(true);
      try {
        const data = await apiService.reference.getAccountCodes();
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
        const data = await apiService.reference.getAccountCodes();
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
    <GenericListView
      data={accountCodes}
      columns={columns}
      title="Account Codes"
      idField="account_code"
      loading={loading}
      error={error}
      onViewJson={onViewJson}
      onRefresh={handleRefresh}
      searchPlaceholder="Search account codes..."
      emptyMessage="No account codes found"
    />
  );
};

export default AccountCodesList;