import React from 'react';
import { DashboardProvider } from '../context/DashboardContext';
import DashboardRouter from './dashboard/DashboardRouter';

/**
 * Main dashboard component that manages navigation and data flow
 * The actual layout is now handled by DashboardRouter and DashboardLayout
 */
const LedgerDashboard = () => {
  return (
    <DashboardProvider>
      <DashboardRouter />
    </DashboardProvider>
  );
};

export default LedgerDashboard;