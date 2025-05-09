import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider, useDashboard } from '../../context/DashboardContext';

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
import ProcessedEventDetailPage from '../processed-events/ProcessedEventDetailPage';
// Template router detail page
import TemplateDetailPage from '../templates/TemplateDetailPage';
import RulesView from '../rules/RulesView';
// Transfers components
import TransfersView from '../transfers/TransfersView';

/**
 * Defines the routing configuration for the dashboard.
 * It sets up all the navigable paths and maps them to their respective components.
 * Utilizes `DashboardLayout` to provide a consistent page structure.
 * The `handleViewJson` function from `useDashboard` context is passed to some routes
 * to enable a consistent way of viewing raw JSON data for specific items.
 * 
 * @returns {JSX.Element} The configured React Router <Routes> component.
 */
const DashboardRoutes = () => {
  const { handleViewJson } = useDashboard();
  
  return (
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
        
        {/* Templates: list and router-based detail */}
        <Route path="templates" element={<TemplatesPage onViewJson={handleViewJson} />} />
        <Route path="templates/:templateId" element={<TemplateDetailPage onViewJson={handleViewJson} />} />
        <Route path="event-entry" element={<EventEntryPage onViewJson={handleViewJson} />} />
        {/* Processed Events: list and detail via URL param */}
        <Route path="processed-events" element={<ProcessedEventsView onViewJson={handleViewJson} />} />
        <Route path="processed-events/:eventId" element={<ProcessedEventDetailPage onViewJson={handleViewJson} />} />
        <Route path="rules" element={<RulesView onViewJson={handleViewJson} />} />
        
        {/* Transfers: list and detail */}
        <Route path="transfers" element={<TransfersView onViewJson={handleViewJson} />} />
        <Route path="transfers/:transferId" element={<TransfersView onViewJson={handleViewJson} />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

/**
 * Main router component for the dashboard section of the application.
 * It wraps the `DashboardRoutes` with the `DashboardProvider` to ensure that all
 * dashboard-related routes and components have access to the shared dashboard context.
 * 
 * @returns {JSX.Element} The DashboardRouter component with context provider and routes.
 */
const DashboardRouter = () => {
  return (
    <DashboardProvider>
      <DashboardRoutes />
    </DashboardProvider>
  );
};

export default DashboardRouter;