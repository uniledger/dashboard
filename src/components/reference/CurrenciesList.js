import React, { useState, useEffect } from 'react';
import { GenericListView } from '../common';
import apiService from '../../services/apiService';

/**
 * Currencies List component using GenericListView
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
    },
    {
      key: 'symbol',
      header: 'Symbol',
      cellClassName: 'text-gray-500',
      render: (currency) => currency.symbol || 'N/A'
    }
  ];

  useEffect(() => {
    const loadCurrencies = async () => {
      setLoading(true);
      try {
        const response = await apiService.reference.getCurrencies();
        console.log('CurrenciesList response:', response);
        
        // Extract data from the response object
        if (response.ok && response.data) {
          setCurrencies(response.data);
          console.log('CurrenciesList setting currencies:', response.data.length, 'items');
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
    };

    loadCurrencies();
  }, []);

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      setLoading(true);
      try {
        const response = await apiService.reference.getCurrencies();
        console.log('CurrenciesList refresh response:', response);
        
        // Extract data from the response object
        if (response.ok && response.data) {
          setCurrencies(response.data);
          console.log('CurrenciesList refresh setting currencies:', response.data.length, 'items');
          setError(null);
        } else {
          console.error('Failed to refresh currencies:', response.error);
          setError('Failed to refresh currencies. Please try again.');
        }
      } catch (err) {
        console.error('Error refreshing currencies:', err);
        setError('Failed to refresh currencies. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <GenericListView
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