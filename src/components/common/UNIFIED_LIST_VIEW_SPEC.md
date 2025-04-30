# Unified List View Component Specification

## Scope Clarification

This component is designed to be as close to "pure AG Grid" as possible. All features and behaviors should leverage AG Grid's native capabilities except where explicitly noted below.

**The only non-native AG Grid feature required is:**
- Collapsible table sections (expand/collapse the entire grid)

**All other features (pagination, sorting, filtering, column management, CSV export, row count, etc.) must use AG Grid's built-in functionality.**

No custom toolbars, overlays, or injected React nodes are required unless explicitly requested in the future.

## Purpose

The UnifiedListView component provides a standardized, config-driven approach to displaying data in list form throughout the application. This component guarantees consistent behavior, appearance, and user interaction patterns across all list views without requiring any custom implementation code.

## Core Principles

1. **Zero Custom Code**: All lists in the application use exactly the same component with no custom variants.
2. **Config-Driven**: All customization happens through props, not through component modifications.
3. **Consistent Behavior**: All lists must behave identically for loading, refresh, and interactions.
4. **Predictable UI**: Loading spinners, refresh buttons, and JSON view options appear in the same places in all lists.
5. **Separation of Concerns**: Data fetching and state management lives in parent components, not in the list component.

## Component Interface

```jsx
<UnifiedListView
  // Data
  data={arrayOfItems}                  // Required: Array of data objects to display
  columns={columnDefinitions}          // Required: Array of column configuration objects
  
  // Identification
  title="List Title"                   // Required: Title displayed in the header
  idField="id"                         // Required: Field used as unique identifier in the data objects
  
  // Actions
  onRefresh={fetchData}                // Required: Function to reload data (must return Promise)
  onViewJson={handleViewJson}          // Optional: Function to handle viewing JSON data
  onRowClick={handleRowClick}          // Optional: Function called when a row is clicked
  onExportCsv={handleExportCsv}        // Optional: Function to export data as CSV
  
  // State
  loading={isLoading}                  // Required: Boolean indicating if data is loading
  error={errorObject}                  // Optional: Error object to display if data fetch fails
  
  // Display options
  emptyMessage="No items found"        // Optional: Message to display when no data is available
  searchPlaceholder="Search..."        // Optional: Placeholder text for search input
  filter={filterObject}                // Optional: Active filter to display (e.g., { field: 'type', value: 'customer' })
  filters={availableFilters}           // Optional: Array of available filters
  onClearFilter={handleClearFilter}    // Optional: Function to clear active filter
  onApplyFilter={handleApplyFilter}    // Optional: Function to apply a filter
  onSearch={handleSearch}              // Optional: Function to handle search
  smallHeader={false}                  // Optional: Whether to use a compact header
  gridHeight="auto"                    // Optional: Height of the grid ("auto" or specific height in px)
  defaultColDef={defaultColumnConfig}  // Optional: Default column configuration
  collapsible={false}                  // Optional: Whether list can be collapsed/expanded
  defaultCollapsed={false}             // Optional: Initial collapsed state
  onCollapsedChange={handleCollapse}   // Optional: Function called when collapsed state changes
  collapseTitle="Show/Hide"            // Optional: Title for the collapse toggle
  // Pagination
  pagination={true}                    // Optional: Enable AG Grid pagination (default: true)
  paginationPageSize={25}              // Optional: Default rows per page
  paginationPageSizeOptions={[10,25,50,100]} // Optional: Page size options for user
  suppressPaginationPanel={false}      // Optional: Hide pagination controls (default: false)
  serverSidePagination={false}         // Optional: Use server-side pagination (parent handles fetch)
/>

## Column Configuration

```javascript
const columns = [
  {
    key: "fieldName",                     // Required: Data field to display
    header: "Column Header",              // Required: Column header text
    cellClassName: "css-class",           // Optional: CSS class for cells
    cellClassNameFn: (item) => "class",   // Optional: Function to determine cell class
    align: "left|right|center",           // Optional: Text alignment
    render: (item) => <CustomContent />,  // Optional: Custom render function
    width: 150,                           // Optional: Initial column width in px
    minWidth: 80,                         // Optional: Minimum column width in px
    maxWidth: 300,                        // Optional: Maximum column width in px
    resizable: true,                      // Optional: Whether this column can be resized
    sortable: true,                       // Optional: Whether this column can be sorted
    pinned: "left|right",                 // Optional: Pin column to left or right
    hide: false                           // Optional: Whether column is hidden by default
  }
]

## Advanced Features

### Filtering

The UnifiedListView supports two types of filtering:

1. **Search Filtering**: Simple text-based filtering across all columns
2. **Field Filtering**: More specific filtering on particular fields

Field filters are defined as:

```javascript
const availableFilters = [
  {
    field: "type",                     // Field to filter on
    label: "Type",                     // Display label
    options: [                         // Available filter options
      { value: "customer", label: "Customer" },
      { value: "vendor", label: "Vendor" }
    ]
  },
  {
    field: "status",
    label: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ]
  }
]
```

### CSV Export

Every list supports exporting the current data to CSV:

1. A download icon appears in the list header
2. Clicking it triggers the `onExportCsv` function
3. If not provided, a default function will export all visible data

### Column Management

These features are provided natively by AG Grid:

1. Column resizing by dragging separators
2. Column reordering by dragging headers
3. Column show/hide via menu
4. Auto-sizing columns to fit content
5. Column sorting by clicking headers
6. Column filtering through filter panel

### Row Count Display

The component always displays the total row count next to the title:

```
Entities (24)
```

### Collapsible Tables

Lists can be made collapsible with:

1. A toggle icon in the header to expand/collapse
2. State persistence between renders
3. Optional callback when collapsed state changes
4. Collapsed tables show just the header with count and controls

### Pagination

UnifiedListView supports AG Grid's native pagination. You can configure:

- `pagination`: Enable/disable pagination (default: true)
- `paginationPageSize`: Number of rows per page (default: 25)
- `paginationPageSizeOptions`: Selectable page sizes for user
- `suppressPaginationPanel`: Hide/show pagination controls (default: false)
- `serverSidePagination`: Enable server-side pagination (parent handles fetch)

**Options to decide:**

- Default page size (e.g., 25, 50, 100)
- Selectable page sizes for the user
- Client-side vs. server-side pagination (for very large datasets)
- Show/hide pagination panel

## Loading State Behavior

1. The `loading` state is controlled by the parent component.
2. When `loading` is true, a small spinner appears in the list header (not centered on the page).
3. The component remains fully interactive during loading.
4. No skeleton loaders or full-page spinners will be used.

## Refresh Mechanism

1. Every list must have a refresh button that calls the `onRefresh` function.
2. The `onRefresh` function must return a Promise.
3. The parent component must set `loading={true}` when refresh starts and `loading={false}` when it completes.
4. Parent components should handle all errors and provide error messages when appropriate.

## Error Handling

1. If an `error` prop is provided, the component displays an error message.
2. The error display includes a "Retry" button that calls the `onRefresh` function.
3. Errors do not prevent the list from being displayed if data is available.

## Child Lists in Detail Views

1. Child lists (nested in detail views) must use the UnifiedListView component.
2. Each child list must receive its own dedicated `onRefresh` function that refreshes only its data.
3. Child lists must never share loading state with parent components unless the API naturally refreshes both.

## Implementation Rules

1. Follow 2-space indentation.
2. Use React functional components with hooks.
3. Include JSDoc comments.
4. Use PascalCase for component names.
5. Use camelCase for hooks and util functions.
6. Destructure props with defaults.
7. Use early returns for conditional rendering.
8. Avoid fallback logic or complex conditional rendering.

## Examples

### Parent List View

```jsx
const EntityList = () => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchEntities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.entity.getEntities();
      if (response.ok) {
        setEntities(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);
  
  return (
    <UnifiedListView
      data={entities}
      columns={EntityConfig.columns}
      title="Entities"
      idField="entity_id"
      onRefresh={fetchEntities}
      onViewJson={handleViewJson}
      onRowClick={handleRowClick}
      loading={loading}
      error={error}
      emptyMessage="No entities found"
      filters={EntityConfig.filters}
      onApplyFilter={handleApplyFilter}
      onExportCsv={handleExportCsv}
      gridHeight="auto"
      collapsible={true}
      defaultCollapsed={false}
    />
  );
};
```

### Child List in Detail View

```jsx
const EntityDetail = () => {
  const { entityId } = useParams();
  const [entity, setEntity] = useState(null);
  const [entityLedgers, setEntityLedgers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ledgersLoading, setLedgersLoading] = useState(false);
  
  const fetchEntity = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.entity.getEntityById(entityId);
      if (response.ok) {
        setEntity(response.data);
      }
    } finally {
      setLoading(false);
    }
  }, [entityId]);
  
  const fetchEntityLedgers = useCallback(async () => {
    setLedgersLoading(true);
    try {
      const response = await apiService.entity.getEntityLedgers(entityId);
      if (response.ok) {
        setEntityLedgers(response.data);
      }
    } finally {
      setLedgersLoading(false);
    }
  }, [entityId]);
  
  useEffect(() => {
    fetchEntity();
    fetchEntityLedgers();
  }, [fetchEntity, fetchEntityLedgers]);
  
  // Entity details rendering...
  
  return (
    <>
      {/* Entity details */}
      <UnifiedListView
        data={entityLedgers}
        columns={LedgerConfig.columns}
        title="Ledgers"
        idField="ledger_id"
        onRefresh={fetchEntityLedgers}
        onViewJson={handleViewJson}
        onRowClick={handleViewLedger}
        loading={ledgersLoading}
        emptyMessage="No ledgers found for this entity"
        filters={LedgerConfig.filters}
        onApplyFilter={handleApplyFilter}
        onExportCsv={handleExportCsv}
        gridHeight="auto"
        collapsible={true}
        defaultCollapsed={false}
      />
    </>
  );
};
