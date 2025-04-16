import React, { useState, useEffect } from 'react';
import { StandardList } from '../common';
import { fetchCurrencies } from '../../utils/apiService';

/**
 * Currencies List component using StandardList for consistent behavior
 */
const CurrenciesList = ({ onViewJson, onRefresh }) => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
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
    }
  ];

  useEffect(() => {
    const loadCurrencies = async () => {
      setLoading(true);
      try {
        const data = await fetchCurrencies();
        setCurrencies(data);
        setError(null);
      } catch (err) {
        console.error('Error loading currencies:', err);
        setError('Failed to load currencies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      setLoading(true);
      try {
        const data = await fetchCurrencies();
        setCurrencies(data);
        setError(null);
      } catch (err) {
        console.error('Error refreshing currencies:', err);
        setError('Failed to refresh currencies. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <StandardList
      data={currencies}
      columns={columns}
      title="Currencies"
      idField="currency_code"
      loading={loading}
      error={error}
      onViewJson={onViewJson}
      onRefresh={handleRefresh}
      searchPlaceholder="Search currencies..."
      emptyMessage="No currencies found"
    />
  );
};

export default CurrenciesList;