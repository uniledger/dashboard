import React, { useState, useEffect } from 'react';
import { GenericListView } from '../common';
import apiService from '../../services/apiService';

/**
 * Currencies List component using GenericListView
 */
const CurrenciesList = ({ onViewJson, onRefresh }) => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define columns for the DataTable
  const columns = [
    {
      key: 'currency_code',
      header: 'Currency Code',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      key: 'type',
      header: 'Type',
      cellClassName: 'text-gray-500',
      render: (currency) => currency.type || 'N/A'
    },
    {
      key: 'scale',
      header: 'Decimal Places',
      cellClassName: 'text-gray-500',
      render: (currency) => typeof currency.scale === 'number' ? currency.scale : 'N/A'
    },
    {
      key: 'symbol',
      header: 'Symbol',
      cellClassName: 'text-gray-500',
      render: (currency) => currency.symbol || 'N/A'
    }
  ];

  // Unified fetch function for initial load and refresh
  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const response = await apiService.reference.getCurrencies();
      
      if (response.ok && response.data) {
        setCurrencies(response.data);
        setError(null);
      } else {
        console.error('Failed to load currencies:', response.error);
        setError('Failed to load currencies. Please try again.');
        setCurrencies([]);
      }
    } catch (err) {
      console.error('Error loading currencies:', err);
      setError('Failed to load currencies. Please try again.');
      setCurrencies([]);
    } finally {
      setLoading(false);
    }
    return Promise.resolve(); // Ensure we return a promise for GenericListView
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return (
    <GenericListView
      data={currencies}
      columns={columns}
      title="Currencies"
      idField="currency_code"
      loading={loading}
      error={error}
      onViewJson={onViewJson}
      onRefresh={fetchCurrencies}
      searchPlaceholder="Search currencies..."
      emptyMessage="No currencies found"
    />
  );
};

export default CurrenciesList;