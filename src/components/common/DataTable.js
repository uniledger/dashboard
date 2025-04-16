import React from 'react';

/**
 * Reusable data table component with universal ID column drilldown
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
  // If idField is not explicitly specified, use the key of the first column
  const actualIdField = idField || (columns.length > 0 ? columns[0].key : null);
  
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

  return (
    <div className={`bg-white shadow overflow-hidden rounded-lg ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {processedColumns.map(column => (
                <th 
                  key={column.key} 
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.headerClassName || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={colSpan} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr 
                  key={item.id || index} 
                  className="hover:bg-gray-50"
                  style={onRowClick ? { cursor: 'pointer' } : {}}
                >
                  {processedColumns.map((column, colIndex) => (
                    <td 
                      key={`${item.id || index}-${column.key}`} 
                      className={`px-6 py-4 whitespace-nowrap text-sm ${column.cellClassName || 'text-gray-500'}`}
                      onClick={(e) => {
                        // If this is the first column, always handle the click
                        if (colIndex === 0 && onRowClick) {
                          e.stopPropagation();
                          onRowClick(item);
                        } else if (column.onClick) {
                          // If the column has its own click handler, use that
                          e.stopPropagation();
                          column.onClick(item);
                        } else if (onRowClick && !column.preventRowClick) {
                          // For other columns, trigger the row click handler unless prevented
                          onRowClick(item);
                        }
                      }}
                    >
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;