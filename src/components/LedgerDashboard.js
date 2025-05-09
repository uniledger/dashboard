import React from 'react';
import { DashboardProvider } from '../context/DashboardContext';
import DashboardRouter from './dashboard/DashboardRouter';

/**
 * Core component that sets up the dashboard environment.
 * It wraps the `DashboardRouter` with the `DashboardProvider` to make shared
 * dashboard context (like modal state and filters) available throughout the application.
 * It does not take any direct props.
 * 
 * @returns {JSX.Element} The rendered LedgerDashboard component.
 */
const LedgerDashboard = () => {
  return (
    <DashboardProvider>
      <DashboardRouter />
    </DashboardProvider>
  );
};

export default LedgerDashboard;