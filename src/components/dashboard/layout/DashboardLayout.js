import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import DashboardFooter from './DashboardFooter';
import Sidebar from '../../shared/sidebar/Sidebar';
import DetailModal from '../../shared/DetailModal';
import { useDashboard } from '../../../context/DashboardContext';

/**
 * Layout component that wraps all dashboard pages
 * Contains the sidebar, header, footer, and detail modal
 */
const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { detailModal, handleCloseModal } = useDashboard();
  
  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
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