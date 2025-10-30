import React from 'react';
import { DashboardIcon, FileTextIcon, DatabaseIcon, UserIcon } from './icons/IconComponents';
import type { View } from '../App';


interface SidebarProps {
  activeView: Exclude<View, 'submit'>;
  // FIX: Allow 'profile' view to be set from the sidebar navigation.
  // The previous type excluded 'profile', causing a type error on the Profile NavLink's onClick handler.
  setActiveView: (view: Exclude<View, 'submit'>) => void;
}

const NavLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-3 w-full text-left rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    {icon}
    <span className="mx-4 font-medium">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
            Civic<span className="text-indigo-600">Lens</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavLink
          icon={<DashboardIcon className="w-6 h-6" />}
          label="Dashboard"
          isActive={activeView === 'dashboard'}
          onClick={() => setActiveView('dashboard')}
        />
        <NavLink
          icon={<FileTextIcon className="w-6 h-6" />}
          label="Complaints"
          isActive={activeView === 'complaints'}
          onClick={() => setActiveView('complaints')}
        />
        <NavLink
          icon={<DatabaseIcon className="w-6 h-6" />}
          label="Data Sources"
          isActive={activeView === 'sources'}
          onClick={() => setActiveView('sources')}
        />
        <NavLink
          icon={<UserIcon className="w-6 h-6" />}
          label="Profile"
          isActive={activeView === 'profile'}
          onClick={() => setActiveView('profile')}
        />
      </nav>
    </aside>
  );
};