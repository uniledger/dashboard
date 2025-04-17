import React from 'react';

/**
 * Reusable component for creating data tables inside detail views
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of data objects to display
 * @param {Array} props.columns - Column definitions
 * @param {string} props.title - Table section title
 * @param {function} props.onRowClick - Handler for clicking a row
 * @param {string} props.emptyMessage - Message to display when no data is available
 * @param {function} props.sortFunction - Optional function to sort data
 * @returns {JSX.Element}
 */
const DataTableSection = ({
  data = [],
  columns = [],
  title,
  onRowClick,
  emptyMessage = 'No data available',
  sortFunction
}) => {
  // Sort data if a sort function is provided
  const displayData = sortFunction ? [...data].sort(sortFunction) : data;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={`header-${index}`}
                className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.align === 'right' ? 'text-right' : 
                  column.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayData && displayData.length > 0 ? (
            displayData.map((item, rowIndex) => (
              <tr 
                key={`row-${rowIndex}`} 
                className="hover:bg-gray-50"
                onClick={() => onRowClick && onRowClick(item)}
                style={onRowClick ? { cursor: 'pointer' } : {}}
              >
                {columns.map((column, colIndex) => {
                  // Determine cell content
                  let content = item[column.key];
                  if (column.render) {
                    content = column.render(item);
                  }

                  // Determine cell className
                  let className = `px-6 py-4 whitespace-nowrap text-sm ${
                    column.align === 'right' ? 'text-right' : 
                    column.align === 'center' ? 'text-center' : 'text-left'
                  }`;
                  
                  if (typeof column.cellClassName === 'function') {
                    className += ` ${column.cellClassName(item)}`;
                  } else if (column.cellClassName) {
                    className += ` ${column.cellClassName}`;
                  }

                  // Handle cell click
                  const handleCellClick = (e) => {
                    if (column.onClick) {
                      const stopPropagation = column.onClick(item, e);
                      if (stopPropagation) {
                        e.stopPropagation();
                      }
                    }
                  };

                  return (
                    <td 
                      key={`cell-${rowIndex}-${colIndex}`} 
                      className={className}
                      onClick={column.onClick ? handleCellClick : undefined}
                      style={column.onClick ? { cursor: 'pointer' } : {}}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTableSection;