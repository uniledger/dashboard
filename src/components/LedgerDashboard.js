import React from 'react';
import { DashboardProvider } from '../context/DashboardContext';
import Sidebar from './shared/sidebar';
import DashboardRouter from './dashboard/DashboardRouter';
import DashboardHeader from './dashboard/layout/DashboardHeader';
import DashboardFooter from './dashboard/layout/DashboardFooter';
import { useDashboard } from '../context/DashboardContext';

/**
 * Dashboard layout component that provides the overall structure
 * with sidebar, header, content area, and footer
 */
const DashboardLayout = ({ children }) => {
  const { activeTab, sidebarCollapsed, setSidebarCollapsed, handleTabChange } = useDashboard();
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        {children}
        <DashboardFooter />
      </div>
    </div>
  );
};

/**
 * Main dashboard component that manages navigation and data flow
 * Provides context via DashboardProvider
 */
const LedgerDashboard = () => {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <DashboardRouter />
      </DashboardLayout>
    </DashboardProvider>
  );
};

export default LedgerDashboard;