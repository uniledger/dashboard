import React from 'react';
import StandardList from './StandardList';

/**
 * Data table section for detail views implemented using AG Grid (StandardList)
 * This provides a consistent table experience across the application.
 * When used inside DetailCard, do NOT pass a title as the section label is already displayed.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of data objects to display
 * @param {Array} props.columns - Column definitions
 * @param {string} props.title - Optional title for the table (usually omitted in detail views)
 * @param {function} props.onRowClick - Handler for clicking a row
 * @param {string} props.emptyMessage - Message to display when no data is available
 * @param {function} props.sortFunction - Optional function to sort data
 * @param {function} props.onViewJson - Handler for viewing JSON data
 * @param {function} props.onRefresh - Handler for refreshing data
 * @param {boolean} props.loading - Flag indicating if data is being loaded
 * @returns {JSX.Element}
 */
const DataTableSection = ({
  data = [],
  columns = [],
  title = '',
  onRowClick,
  emptyMessage = 'No data available',
  sortFunction,
  onViewJson,
  onRefresh,
  loading = false,
}) => {
  // Sort data if a sort function is provided
  const displayData = sortFunction ? [...data].sort(sortFunction) : data;
  
  // Process columns to match StandardList format
  const processedColumns = columns.map(column => {
    const result = {
      key: column.key,
      header: column.header,
    };
    
    // Add render function if provided
    if (column.render) {
      result.render = column.render;
    }
    
    // Convert cellClassName function to string
    if (typeof column.cellClassName === 'function') {
      // We can't directly convert function to string, so we'll handle this in StandardList
      result.cellClassNameFn = column.cellClassName;
    } else if (column.cellClassName) {
      result.cellClassName = column.cellClassName;
    }
    
    // Add alignment classes
    if (column.align) {
      const alignClass = column.align === 'right' ? 'text-right' : 
                         column.align === 'center' ? 'text-center' : 'text-left';
      result.cellClassName = result.cellClassName ? 
                             `${result.cellClassName} ${alignClass}` : 
                             alignClass;
    }
    
    // Add onClick handler if provided
    if (column.onClick) {
      result.onClick = column.onClick;
    }
    
    return result;
  });
  
  // Determine idField (use first column key as default)
  const idField = processedColumns.length > 0 ? processedColumns[0].key : 'id';
  
  // Calculate height based on data length (minimum 250px, maximum 500px)
  const height = Math.min(Math.max(250, displayData.length * 50), 500);
  
  return (
    <div className="bg-white rounded-lg overflow-auto">
      <StandardList
        data={displayData}
        columns={processedColumns}
        title={title}
        idField={idField}
        onItemClick={onRowClick}
        emptyMessage={emptyMessage}
        onViewJson={onViewJson}
        onRefresh={onRefresh}
        loading={loading}
        gridHeight={height}
        smallHeader={false} /* Use full header to mimic list views */
      />
    </div>
  );
};

export default DataTableSection;