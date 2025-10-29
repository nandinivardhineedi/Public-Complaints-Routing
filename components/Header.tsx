import React from 'react';
import type { View } from '../App';
import type { User } from './../shared/types';
import { LogoutIcon, UserIcon } from './icons/IconComponents';

interface HeaderProps {
    activeView: View;
    user: User | null;
    onLogout: () => void;
    setActiveView: (view: View) => void;
}

const Avatar: React.FC<{ username: string }> = ({ username }) => {
    const getInitials = (name: string) => {
        const nameParts = name.split(' ').filter(Boolean);
        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
        }
        if (nameParts.length === 1 && nameParts[0].length > 1) {
             return nameParts[0].substring(0, 2).toUpperCase();
        }
        if (nameParts.length === 1 && nameParts[0].length === 1) {
             return nameParts[0].toUpperCase();
        }
        return 'U';
    };

    return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold text-sm border-2 border-indigo-300">
            <span>{getInitials(username)}</span>
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ activeView, user, onLogout, setActiveView }) => {
    const userRole = user?.role;
    
    const getTitle = () => {
        if (userRole === 'user' && activeView === 'submit') {
            return 'Submit a Public Complaint';
        }
        if (userRole === 'user' && activeView === 'profile') {
            return 'Your Profile';
        }
        if (userRole === 'admin') {
            return `CivicLens ${activeView.charAt(0).toUpperCase() + activeView.slice(1)}`;
        }
        return 'CivicLens';
    };

    return (
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">
                    {getTitle()}
                </h1>
            </div>
            <div className="flex items-center space-x-4">
                 {(userRole === 'admin' || activeView === 'profile') && (
                     <button 
                        onClick={() => setActiveView('profile')}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500"
                        title="View Profile"
                        aria-label="View Profile"
                    >
                        <UserIcon className="w-5 h-5" />
                    </button>
                 )}
                 <button 
                    onClick={onLogout}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500"
                >
                    <LogoutIcon className="w-5 h-5 mr-2" />
                    Logout
                </button>
                {user && user.role === 'admin' && ( // Only show avatar and name for admin users
                    <div className="flex items-center">
                        <Avatar username={user.username} />
                        <span className="ml-3 font-semibold text-gray-700">{user.username}</span>
                    </div>
                )}
            </div>
        </header>
    );
};

