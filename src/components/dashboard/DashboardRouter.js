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
import RulesView from '../rules/RulesView';
import DetailModal from '../shared/DetailModal';

/**
 * Dashboard Routes component that contains the actual routes
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
        
        {/* Transactions */}
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="event-entry" element={<EventEntryPage />} />
        <Route path="processed-events" element={<ProcessedEventsView onViewJson={handleViewJson} />} />
        <Route path="rules" element={<RulesView onViewJson={handleViewJson} />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

/**
 * Dashboard Router component that handles navigation between dashboard views
 * Uses React Router for client-side routing
 */
const DashboardRouter = () => {
  return (
    <DashboardProvider>
      <DashboardRoutes />
    </DashboardProvider>
  );
};

export default DashboardRouter;