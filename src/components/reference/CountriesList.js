import React, { useState, useEffect } from 'react';
import { StandardList } from '../common';
import { fetchCountries } from '../../utils/apiService';

/**
 * Countries List component using StandardList for consistent behavior
 */
const CountriesList = ({ onViewJson, onRefresh }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define columns for the DataTable
  const columns = [
    {
      key: 'country_code',
      header: 'Country Code',
      cellClassName: 'font-medium text-gray-900',
    },
    {
      key: 'name',
      header: 'Name',
      cellClassName: 'text-gray-500',
      render: (country) => country.name || 'N/A'
    },
    {
      key: 'region',
      header: 'Region',
      cellClassName: 'text-gray-500',
      render: (country) => country.region || 'N/A'
    }
  ];

  useEffect(() => {
    const loadCountries = async () => {
      setLoading(true);
      try {
        const data = await fetchCountries();
        setCountries(data);
        setError(null);
      } catch (err) {
        console.error('Error loading countries:', err);
        setError('Failed to load countries. Please try again.');
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
        const data = await fetchCountries();
        setCountries(data);
        setError(null);
      } catch (err) {
        console.error('Error refreshing countries:', err);
        setError('Failed to refresh countries. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <StandardList
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