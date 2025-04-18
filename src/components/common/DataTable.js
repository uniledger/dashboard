import React from 'react';
import StandardList from './StandardList';

/**
 * Reusable data table component with universal ID column drilldown
 * using AG Grid under the hood for consistent UX
 * 
 * @param {Object} props - Component props
 * @param {Array} props.columns - Table column definitions with keys, headers, and render functions
 * @param {Array} props.data - Data to display in the table
 * @param {boolean} props.loading - Loading state
 * @param {function} props.onRowClick - Function to call when a row is clicked
 * @param {string} props.emptyMessage - Message to display when there is no data
 * @param {number} props.colSpan - Number of columns for loading and empty states
 * @param {string} props.idField - Name of the ID field (default: first column key)
 * @returns {JSX.Element} - Rendered component
 */
const DataTable = ({ 
  columns, 
  data = [], 
  loading = false,
  onRowClick,
  emptyMessage = 'No data found',
  colSpan = 5,
  className = '',
  idField = null
}) => {
  
  // Make sure the first column is styled as a drilldown link if we have an onRowClick handler
  const processedColumns = columns.map((column, index) => {
    if (index === 0 && onRowClick) {
      return {
        ...column,
        cellClassName: column.cellClassName || 'text-blue-600 hover:underline cursor-pointer font-medium'
      };
    }
    return column;
  });

  // If no idField provided, use the first column's key
  const autoIdField = idField || (processedColumns.length > 0 ? processedColumns[0].key : 'id');
  
  // Calculate grid height based on data rows (min 200, max 400)
  const gridHeight = Math.min(Math.max(200, data.length * 40 + 50), 400);
  
  return (
    <div className={`bg-white shadow overflow-hidden rounded-lg ${className}`}>
      <StandardList
        data={data}
        columns={processedColumns}
        title=""
        idField={autoIdField}
        onItemClick={onRowClick}
        loading={loading}
        emptyMessage={emptyMessage}
        gridHeight={gridHeight}
        smallHeader={true}
      />
    </div>
  );
};

export default DataTable;