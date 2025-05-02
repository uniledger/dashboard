import React, { useState, useEffect } from 'react';
import { GenericListView } from '../common';
import apiService from '../../services/apiService';

/**
 * Countries List component using GenericListView
 */
const CountriesList = ({ onViewJson, onRefresh }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define columns for the DataTable
  const columns = [
    {
      field: 'country_code',
      headerName: 'Country Code',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      field: 'alpha_3_code',
      headerName: 'Alpha-3 Code',
      cellClassName: 'text-gray-500',
      render: (country) => country.alpha_3_code || 'N/A'
    },
    {
      field: 'numeric_code',
      headerName: 'Numeric Code',
      cellClassName: 'text-gray-500',
      render: (country) => country.numeric_code || 'N/A'
    },
    {
      field: 'name',
      headerName: 'Name',
      cellClassName: 'text-gray-500',
      render: (country) => country.name || 'N/A'
    },
    {
      field: 'region',
      headerName: 'Region',
      cellClassName: 'text-gray-500',
      render: (country) => country.region || 'N/A'
    },
    {
      field: 'currency_code',
      headerName: 'Currency Code',
      cellClassName: 'text-gray-500',
      render: (country) => country.currency_code || 'N/A'
    }
  ];

  useEffect(() => {
    const loadCountries = async () => {
      setLoading(true);
      try {
        const response = await apiService.reference.getCountries();
        console.log('CountriesList response:', response);
        
        // Extract data from the response object
        if (response.ok && response.data) {
          setCountries(response.data);
          console.log('CountriesList setting countries:', response.data.length, 'items');
          setError(null);
        } else {
          console.error('Failed to load countries:', response.error);
          setError('Failed to load countries. Please try again.');
          setCountries([]);
        }
      } catch (err) {
        console.error('Error loading countries:', err);
        setError('Failed to load countries. Please try again.');
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      setLoading(true);
      try {
        const response = await apiService.reference.getCountries();
        console.log('CountriesList refresh response:', response);
        
        // Extract data from the response object
        if (response.ok && response.data) {
          setCountries(response.data);
          console.log('CountriesList refresh setting countries:', response.data.length, 'items');
          setError(null);
        } else {
          console.error('Failed to refresh countries:', response.error);
          setError('Failed to refresh countries. Please try again.');
        }
      } catch (err) {
        console.error('Error refreshing countries:', err);
        setError('Failed to refresh countries. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <GenericListView
      data={countries}
      columns={columns}
      title="Countries"
      idField="country_code"
      loading={loading}
      error={error}
      onViewJson={onViewJson}
      onRefresh={handleRefresh}
      searchPlaceholder="Search countries..."
      emptyMessage="No countries found"
    />
  );
};

export default CountriesList;