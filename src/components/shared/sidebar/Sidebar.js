import React from 'react';
import { 
  BarChart2, 
  Book, 
  Briefcase, 
  Users, 
  DollarSign, 
  Globe, 
  Tag, 
  FileText, 
  CheckSquare, 
  Shield, 
  ChevronLeft,
  ChevronRight
} from 'react-icons/fi';

/**
 * Sidebar navigation component
 */
const Sidebar = ({ activeTab, onTabChange, collapsed, setCollapsed }) => {
  // Define navigation items with icons and categories
  const mainTabs = [
    { id: 'dashboard', name: 'Balance Sheet', icon: BarChart2 },
    { id: 'ledgers', name: 'Ledgers', icon: Book },
    { id: 'accounts', name: 'Accounts', icon: Briefcase },
    { id: 'entities', name: 'Entities', icon: Users },
  ];

  const referenceTabs = [
    { id: 'currencies', name: 'Currencies', icon: DollarSign },
    { id: 'countries', name: 'Countries', icon: Globe },
    { id: 'account-codes', name: 'Account Codes', icon: Tag },
  ];

  const transactionTabs = [
    { id: 'templates', name: 'Templates', icon: FileText },
    { id: 'processed-events', name: 'Processed Events', icon: CheckSquare },
    { id: 'rules', name: 'Rules', icon: Shield },
  ];

  // Render navigation item
  const renderNavItem = (tab) => {
    const Icon = tab.icon;
    
    return (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`flex items-center w-full py-2 px-3 my-1 rounded ${collapsed ? 'justify-center' : 'px-4'} ${
          activeTab === tab.id
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Icon className={`${collapsed ? '' : 'mr-3'} w-5 h-5`} />
        {!collapsed && <span className="text-sm">{tab.name}</span>}
      </button>
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

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full ${collapsed ? 'w-16' : 'w-64'}`}>
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
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="overflow-y-auto flex-grow py-4">
        {renderSection('Main', mainTabs)}
        {renderSection('Reference', referenceTabs)}
        {renderSection('Transactions', transactionTabs)}
      </div>
    </div>
  );
};

export default Sidebar;