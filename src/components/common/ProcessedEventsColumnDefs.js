/**
 * Hard-coded column definitions for processed events
 */

/**
 * Get column definitions for the TestProcessedEvents view
 * This is a direct approach that ensures right alignment of amount column
 */
export const getProcessedEventsColumns = () => [
  // Event ID column
  {
    field: 'event_id',
    headerName: 'ID',
    cellClass: 'text-blue-600 hover:underline cursor-pointer font-medium',
    sortable: true,
    filter: true,
    resizable: true
  },
  // Status column
  {
    field: 'status',
    headerName: 'Status',
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: true,
    cellRenderer: params => {
      const status = params.value || 'UNKNOWN';
      let className = 'px-2 py-1 text-xs rounded-full ';
      
      switch (status.toUpperCase()) {
        case 'COMPLETE':
          className += 'bg-green-100 text-green-800';
          break;
        case 'PENDING':
          className += 'bg-yellow-100 text-yellow-800';
          break;
        case 'FAILED':
          className += 'bg-red-100 text-red-800';
          break;
        default:
          className += 'bg-gray-100 text-gray-800';
      }
      
      return `<span class="${className}">${status}</span>`;
    }
  },
  // Template column
  {
    field: 'template_id',
    headerName: 'Template',
    sortable: true,
    filter: true,
    resizable: true,
    cellRenderer: params => {
      if (!params.data) return 'N/A';
      
      const id = params.data.template?.template_id || params.data.template_id;
      const name = params.data.template?.name;
      
      if (!id) return 'N/A';
      
      if (name) {
        return `${name} (${id})`;
      }
      
      return id;
    }
  },
  // Timestamp column
  {
    field: 'timestamp',
    headerName: 'Created',
    sortable: true,
    filter: true,
    resizable: true,
    valueFormatter: params => {
      if (!params.data || !params.data.timestamp) return 'N/A';
      return new Date(params.data.timestamp * 1000).toLocaleString();
    }
  },
  // Amount column
  {
    field: 'amount',
    headerName: 'Amount',
    sortable: true,
    filter: 'agNumberColumnFilter',
    resizable: true,
    cellStyle: { textAlign: 'right' },
    valueFormatter: params => {
      if (!params.value || typeof params.value !== 'number') return 'N/A';
      
      return params.value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  }
];

export default getProcessedEventsColumns;
