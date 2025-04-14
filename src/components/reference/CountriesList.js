import React, { useState, useEffect } from 'react';
import PageHeader from '../shared/PageHeader';
import { fetchCountries } from '../../utils/apiService';

/**
 * Countries List component to display all available countries
 */
const CountriesList = ({ onViewJson, onRefresh }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div>
      <PageHeader 
        title="Countries" 
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
                Country Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : countries && countries.length > 0 ? countries.map((country) => (
              <tr key={country.country_id || country.country_code} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {country.country_code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {country.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {country.region || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <button 
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => onViewJson && onViewJson(country, `Country: ${country.name}`)}
                  >
                    JSON
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No countries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CountriesList;