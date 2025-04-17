# React Router Implementation Guide

This guide provides a step-by-step approach to refactoring the UniLedger Dashboard application from using Context-based navigation to React Router.

## 1. Install Dependencies

First, add react-router-dom to the project:

```bash
npm install react-router-dom
```

## 2. Setup Router

Modify `src/index.js` to implement the BrowserRouter:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
```

## 3. Define Routes

Refactor `src/components/dashboard/DashboardRouter.js`:

```jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from '../../context/DashboardContext';

// Import layout component
import DashboardLayout from './layout/DashboardLayout';

// Import view components
import DashboardView from './DashboardView';
import EntityList from '../entities/EntityList';
import EntityDetail from '../entities/EntityDetail';
import LedgerList from '../ledgers/LedgerList';
import LedgerDetail from '../ledgers/LedgerDetail';
import AccountList from '../accounts/AccountList';
import AccountDetail from '../accounts/AccountDetail';
import CurrenciesList from '../reference/CurrenciesList';
import CountriesList from '../reference/CountriesList';
import AccountCodesList from '../reference/AccountCodesList';
import TemplatesPage from '../templates/TemplatesPage';
import EventEntryPage from '../events/EventEntryPage';
import ProcessedEventsView from '../processed-events/ProcessedEventsView';
import RulesView from '../rules/RulesView';

const DashboardRouter = () => {
  return (
    <DashboardProvider>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          {/* Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardView />} />
          
          {/* Entities */}
          <Route path="entities">
            <Route index element={<EntityList />} />
            <Route path=":entityId" element={<EntityDetail />} />
          </Route>
          
          {/* Ledgers */}
          <Route path="ledgers">
            <Route index element={<LedgerList />} />
            <Route path=":ledgerId" element={<LedgerDetail />} />
          </Route>
          
          {/* Accounts */}
          <Route path="accounts">
            <Route index element={<AccountList />} />
            <Route path=":accountId" element={<AccountDetail />} />
          </Route>
          
          {/* Reference Data */}
          <Route path="currencies" element={<CurrenciesList />} />
          <Route path="countries" element={<CountriesList />} />
          <Route path="account-codes" element={<AccountCodesList />} />
          
          {/* Transactions */}
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="event-entry" element={<EventEntryPage />} />
          <Route path="processed-events" element={<ProcessedEventsView />} />
          <Route path="rules" element={<RulesView />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </DashboardProvider>
  );
};

export default DashboardRouter;
```

## 4. Create Dashboard Layout Component

Create a new layout component that will contain the persistent UI elements:

```jsx
// src/components/dashboard/layout/DashboardLayout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import DashboardFooter from './DashboardFooter';
import Sidebar from '../../shared/sidebar/Sidebar';
import DetailModal from '../../shared/DetailModal';
import { useDashboard } from '../../../context/DashboardContext';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { detailModal, handleCloseModal } = useDashboard();
  
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-full px-2 py-3">
            <Outlet />
          </div>
        </main>
        
        <DashboardFooter />
      </div>
      
      <DetailModal 
        isOpen={detailModal.isOpen}
        data={detailModal.data}
        title={detailModal.title}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default DashboardLayout;
```

## 5. Update Sidebar Navigation

Refactor the Sidebar component to use React Router's `<NavLink>` component:

```jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

// Icons object remains the same as before

const Sidebar = ({ collapsed, setCollapsed }) => {
  // Define navigation items with icons and categories
  const mainTabs = [
    { id: 'dashboard', path: '/dashboard', name: 'Balance Sheet', icon: 'BarChart2' },
    { id: 'ledgers', path: '/ledgers', name: 'Ledgers', icon: 'Book' },
    { id: 'accounts', path: '/accounts', name: 'Accounts', icon: 'Briefcase' },
    { id: 'entities', path: '/entities', name: 'Entities', icon: 'Users' },
  ];

  const referenceTabs = [
    { id: 'currencies', path: '/currencies', name: 'Currencies', icon: 'DollarSign' },
    { id: 'countries', path: '/countries', name: 'Countries', icon: 'Globe' },
    { id: 'account-codes', path: '/account-codes', name: 'Account Codes', icon: 'Tag' },
  ];

  const transactionTabs = [
    { id: 'templates', path: '/templates', name: 'Templates', icon: 'FileText' },
    { id: 'event-entry', path: '/event-entry', name: 'Event Entry', icon: 'PlusCircle' },
    { id: 'processed-events', path: '/processed-events', name: 'Processed Events', icon: 'CheckSquare' },
    { id: 'rules', path: '/rules', name: 'Rules', icon: 'Shield' },
  ];

  // Render navigation item
  const renderNavItem = (tab) => {
    const icon = icons[tab.icon];
    
    return (
      <NavLink
        key={tab.id}
        to={tab.path}
        className={({ isActive }) => `
          flex items-center w-full py-2 px-3 my-1 rounded ${collapsed ? 'justify-center' : 'px-4'} 
          ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}
        `}
      >
        <span className={`${collapsed ? '' : 'mr-3'} text-lg`}>{icon}</span>
        {!collapsed && <span className="text-sm">{tab.name}</span>}
      </NavLink>
    );
  };

  // Render section with header
  const renderSection = (title, tabs) => (
    <div className="mb-4 px-2">
      {!collapsed && (
        <div className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </div>
      )}
      {tabs.map(renderNavItem)}
    </div>
  );

  // Rest of the component remains the same
  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full ${collapsed ? 'w-14' : 'w-56'}`}>
      {/* Header section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-gray-50">
        {!collapsed && (
          <div className="text-xl font-bold text-gray-900 flex items-center">
            <span className="mr-2">🚀</span>
            Ledger Rocket
          </div>
        )}
        {collapsed && (
          <div className="mx-auto text-xl">
            🚀
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-gray-500 hover:bg-gray-200 ml-auto"
        >
          <span className="text-lg">{collapsed ? icons.ChevronRight : icons.ChevronLeft}</span>
        </button>
      </div>
      
      {/* Navigation sections */}
      <div className="overflow-y-auto flex-grow py-4">
        {renderSection('Main', mainTabs)}
        {renderSection('Reference', referenceTabs)}
        {renderSection('Transactions', transactionTabs)}
      </div>
    </div>
  );
};

export default Sidebar;
```

## 6. Update List Components

Update list components to use React Router's `useNavigate` hook for navigation to detail views:

```jsx
// Example: src/components/entities/EntityList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericListView, EntityConfig } from '../common';

const EntityList = ({ onViewJson, onRefresh }) => {
  const navigate = useNavigate();
  
  // Handle entity click - navigate to entity detail view
  const handleEntityClick = (entityId) => {
    navigate(`/entities/${entityId}`);
  };
  
  // Define the columns for the entity list
  const columns = [...EntityConfig.listColumns];
  
  return (
    <GenericListView
      data={entities}
      columns={columns}
      title="Entities"
      idField={EntityConfig.idField}
      onItemClick={handleEntityClick}
      onViewJson={onViewJson}
      onRefresh={onRefresh}
      searchPlaceholder="Search entities..."
      emptyMessage="No entities found"
    />
  );
};

export default EntityList;
```

## 7. Update Detail Components

Update detail components to use React Router's `useParams` hook to get IDs from the URL:

```jsx
// Example: src/components/entities/EntityDetail.js
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GenericDetailView, DataTableSection, EntityConfig } from '../common';
import useEntities from '../../hooks/useEntities';
import { getCountryDisplay, formatAccountCode, formatBalance, getBalanceClass, getCurrencyInfo } from '../../utils/formatters';

const EntityDetail = ({ onViewJson }) => {
  const { entityId } = useParams();
  const navigate = useNavigate();
  
  const { 
    selectedEntity: entity,
    entityLedgers,
    entityAccounts,
    fetchEntityById,
    refreshEntityAccounts
  } = useEntities();
  
  // Fetch entity data when component mounts or ID changes
  useEffect(() => {
    if (entityId) {
      fetchEntityById(entityId);
    }
  }, [entityId, fetchEntityById]);
  
  if (!entity) return null;
  
  // Handle navigation back to entity list
  const handleBack = () => {
    navigate('/entities');
  };
  
  // Handle refresh
  const handleRefresh = () => {
    refreshEntityAccounts(entityId);
  };
  
  // Handle ledger click - navigate to ledger detail view
  const handleLedgerClick = (ledgerId) => {
    navigate(`/ledgers/${ledgerId}`);
  };
  
  // Handle account click - navigate to account detail view
  const handleAccountClick = (accountId) => {
    navigate(`/accounts/${accountId}`);
  };
  
  // Helper function to format account code
  const getAccountCodeDisplay = (account) => {
    if (!account) return 'N/A';
    return formatAccountCode(account.account_code || account.code);
  };
  
  // Define basic information sections
  const basicSections = EntityConfig.detailSections(entity);
  
  // Define the ledgers table section with Link components for navigation
  const ledgersTableSection = {
    label: 'Ledgers Owned',
    content: (
      <DataTableSection
        data={entityLedgers || []}
        title="Ledgers"
        columns={[
          {
            key: 'ledger_id',
            header: 'ID',
            cellClassName: 'text-blue-600 cursor-pointer hover:underline',
            render: (ledger) => (
              <Link to={`/ledgers/${ledger.ledger_id}`}>
                {ledger.ledger_id}
              </Link>
            )
          },
          // Other columns remain the same
          // ...
        ]}
        onRowClick={(ledger) => handleLedgerClick(ledger.ledger_id)}
        emptyMessage="No ledgers found for this entity"
      />
    )
  };
  
  // Define the accounts table section with Link components for navigation
  // Similar implementation as above, using <Link> components
  // ...
  
  return (
    <GenericDetailView
      data={entity}
      title="Entity Detail"
      subtitle={entity.name}
      sections={basicSections}
      childrenSections={[ledgersTableSection, accountsTableSection]}
      onBack={handleBack}
      onRefresh={handleRefresh}
      onViewJson={onViewJson}
    />
  );
};

export default EntityDetail;
```

## 8. Refactor Context

Update the DashboardContext to remove navigation-related state:

```jsx
import React, { createContext, useContext, useState } from 'react';

// Create Dashboard Context
const DashboardContext = createContext(null);

/**
 * Dashboard Context Provider
 * Manages shared state across dashboard components
 */
export const DashboardProvider = ({ children }) => {
  // Remove navigation-related state
  // const [activeTab, setActiveTab] = useState('dashboard');
  // const [selectedEntityId, setSelectedEntityId] = useState(null);
  // const [selectedLedgerId, setSelectedLedgerId] = useState(null);
  // const [selectedAccountId, setSelectedAccountId] = useState(null);
  
  // Filter state (keep this)
  const [accountsFilter, setAccountsFilter] = useState({
    active: false,
    type: ''
  });
  
  // Auto-refresh state (keep this)
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10 seconds
  
  // Detail modal state (keep this)
  const [detailModal, setDetailModal] = useState({ 
    isOpen: false, 
    data: null, 
    title: '' 
  });
  
  // Global error state (keep this)
  const [error, setError] = useState(null);
  
  // UI state (keep this)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Remove navigation-related handlers
  // handleTabChange, handleEntitySelection, handleLedgerSelection, handleAccountSelection
  
  // Keep filter-related handler
  const handleDrillToAccounts = (accountType) => {
    // Set the filter only
    setAccountsFilter({
      active: true,
      type: accountType
    });
    // Navigation is now handled by React Router
  };

  // Keep modal-related handlers
  const handleViewJson = (data, title) => {
    setDetailModal({
      isOpen: true,
      data,
      title
    });
  };

  const handleCloseModal = () => {
    setDetailModal({
      isOpen: false,
      data: null,
      title: ''
    });
  };
  
  // Context value, remove navigation-related state and actions
  const value = {
    // State
    accountsFilter,
    autoRefreshEnabled,
    refreshInterval,
    detailModal,
    error,
    sidebarCollapsed,
    
    // Actions
    setAccountsFilter,
    setAutoRefreshEnabled,
    setRefreshInterval,
    setDetailModal,
    setError,
    setSidebarCollapsed,
    
    // Handlers
    handleDrillToAccounts,
    handleViewJson,
    handleCloseModal
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext;
```

## 9. Update Data Hooks

Refactor the data hooks to work with React Router:

```jsx
// Example: src/hooks/useEntities.js
import { useState, useCallback } from 'react';
import { apiService } from '../services/apiService';

const useEntities = () => {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityLedgers, setEntityLedgers] = useState([]);
  const [entityAccounts, setEntityAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch all entities
  const fetchEntities = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiService.fetchEntities();
      setEntities(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching entities:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch entity by ID
  const fetchEntityById = useCallback(async (entityId) => {
    if (!entityId) return;
    
    setLoading(true);
    try {
      const entity = await apiService.fetchEntityById(entityId);
      setSelectedEntity(entity);
      
      // Also fetch related data
      const ledgers = await apiService.fetchEntityLedgers(entityId);
      setEntityLedgers(ledgers);
      
      const accounts = await apiService.fetchEntityAccounts(entityId);
      setEntityAccounts(accounts);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching entity:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Other methods remain largely the same
  // ...
  
  return {
    entities,
    selectedEntity,
    entityLedgers,
    entityAccounts,
    loading,
    error,
    fetchEntities,
    fetchEntityById,
    // ... other methods
  };
};

export default useEntities;
```

## 10. Update View Components to Use Links/Navigations

For components that cross-link between different sections, update them to use React Router:

```jsx
// Example: Using Link in a data table
<Link to={`/entities/${account.entity_id}`} className="text-blue-600 hover:underline">
  {account.entity_name}
</Link>

// Example: Using useNavigate in an event handler
const navigate = useNavigate();
const handleEntityClick = (entityId) => {
  navigate(`/entities/${entityId}`);
};
```

## 11. Add Filtering via URL Query Parameters

Add query parameter support for filtering:

```jsx
// In AccountList.js
import { useSearchParams, useNavigate } from 'react-router-dom';

const AccountList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const accountType = searchParams.get('type');
  
  // Apply filter based on URL query param
  const filteredAccounts = accountType 
    ? filterUtils.filterAccountsByType(accounts, accountType)
    : accounts;
    
  // Update filter via URL
  const handleFilterChange = (type) => {
    if (type) {
      setSearchParams({ type });
    } else {
      setSearchParams({});
    }
  };
  
  // ...
};
```

## 12. Update DashboardView for Drill-Down Navigation

Update the DashboardView component to navigate using React Router:

```jsx
// In DashboardView.js
import { useNavigate } from 'react-router-dom';

const DashboardView = () => {
  const navigate = useNavigate();
  
  const handleDrillDown = (accountType) => {
    navigate(`/accounts?type=${accountType}`);
  };
  
  // ...
};
```

## 13. Testing

Test all navigation paths, including:
- Direct URL access to detail pages
- Browser back/forward navigation
- Links between related items
- Sidebar navigation
- Filter retention when navigating
- Query parameter filtering

## 14. Cleanup

Remove any unused code that was related to the old navigation system:
- Remove unused state in DashboardContext
- Remove unused route handlers in DashboardRouter
- Remove unused navigation props throughout components
- Update tests to work with the new router-based navigation

## Summary

By following these steps, you'll transform the application from using context-based navigation to a modern React Router implementation with proper URL-based navigation, allowing for deep linking, browser history support, and more maintainable routing code.