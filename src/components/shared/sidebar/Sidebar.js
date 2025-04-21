import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart, BookOpen, Briefcase, Users, DollarSign, Globe, Tag, FileText,
  CheckSquare, Shield, PlusCircle, CreditCard
} from 'lucide-react';
 
const icons = {
  BarChart2: BarChart,
  Book: BookOpen,
  Briefcase: Briefcase, 
  Users: Users,
  DollarSign: DollarSign,
  Globe: Globe,
  Tag: Tag,
  FileText: FileText,
  CheckSquare: CheckSquare,
  Shield: Shield,  
  PlusCircle: PlusCircle,
  CreditCard: CreditCard
};

/**
 * Sidebar navigation component
 */
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
    { id: 'event-entry', path: '/event-entry', name: 'Process Event', icon: 'PlusCircle' },
    { id: 'processed-events', path: '/processed-events', name: 'Processed Events', icon: 'CheckSquare' },
    { id: 'transfers', path: '/transfers', name: 'Transfers', icon: 'CreditCard' },
    { id: 'rules', path: '/rules', name: 'Compliance Rules', icon: 'Shield' },
  ];

  // Render navigation item
  const renderNavItem = (tab) => {
    const IconComponent = icons[tab.icon];
    
    return (
      <NavLink
        key={tab.id}
        to={tab.path}
        className={({ isActive }) => ` 
          flex items-center w-full py-2 px-3 my-1 rounded ${collapsed ? 'justify-center' : 'px-4'} 
          ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}
        `}
      >
        <span className={`${collapsed ? '' : 'mr-3'} text-lg`}><IconComponent /></span>
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

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full ${collapsed ? 'w-14' : 'w-56'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-gray-50">
        {!collapsed ? (
          <div 
            className="text-xl font-bold text-gray-900 flex items-center cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          >
            <span className="mr-2">🚀</span>
            <span>Ledger Rocket</span>
          </div>
        ) : (
          <div 
            className="mx-auto text-xl cursor-pointer" 
            onClick={() => setCollapsed(!collapsed)}
          >
            🚀
          </div>
        )}
      </div>
      
      <div className="overflow-y-auto flex-grow py-4">
        {renderSection('Main', mainTabs)}
        {renderSection('Transactions', transactionTabs)}
        {renderSection('Reference', referenceTabs)}
      </div>
    </div>
  );
};

export default Sidebar;