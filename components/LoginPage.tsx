import React, { useState } from 'react';
import type { UserRole } from '../App';

interface LoginPageProps {
    onLogin: (role: UserRole, username?: string, password?: string) => Promise<boolean>; // Updated to async
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminLoginError, setAdminLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false); // New state for loading feedback

    const handleAdminLogin = async (e: React.FormEvent) => { // Made async
        e.preventDefault();
        setIsLoggingIn(true);
        setAdminLoginError('');
        try {
            const success = await onLogin('admin', adminUsername, adminPassword); // Await the async login
            if (!success) {
                setAdminLoginError('Invalid admin username or password.');
            }
        } catch (error) {
            setAdminLoginError(`Login failed: ${(error as Error).message}`);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleUserLogin = async () => { // Made async
        setIsLoggingIn(true);
        try {
            await onLogin('user'); // Await the async login
        } catch (error) {
            setAdminLoginError(`Login failed: ${(error as Error).message}`);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-2xl border border-gray-200">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Civic<span className="text-indigo-600">Lens</span>
                    </h1>
                    <p className="mt-2 text-gray-500">AI-Powered Public Complaint Analysis</p>
                </div>

                <div className="space-y-6">
                    {/* Admin Login Section */}
                    <div className="border border-indigo-200 rounded-lg p-6 bg-indigo-50">
                        <h2 className="text-xl font-bold text-indigo-800 mb-4">Admin Login</h2>
                        <form onSubmit={handleAdminLogin} className="space-y-4">
                            <div>
                                <label htmlFor="admin-username" className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    type="text"
                                    id="admin-username"
                                    value={adminUsername}
                                    onChange={(e) => setAdminUsername(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Admin Username"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    id="admin-password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Admin Password"
                                    required
                                />
                            </div>
                            {adminLoginError && (
                                <p className="text-red-600 text-sm mt-2" role="alert">{adminLoginError}</p>
                            )}
                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 transition-transform transform hover:scale-105 duration-300 disabled:bg-indigo-400"
                            >
                                {isLoggingIn ? 'Logging In...' : 'Login as Admin'}
                            </button>
                            <p className="text-xs text-center mt-2 text-indigo-700">Access the analytics and management dashboard.</p>
                        </form>
                    </div>

                    {/* User Login Section */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Citizen Login</h2>
                        <button
                            onClick={handleUserLogin} // Use async handler
                            disabled={isLoggingIn}
                            className="w-full px-4 py-3 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-500 transition-transform transform hover:scale-105 duration-300 disabled:bg-gray-400"
                        >
                            {isLoggingIn ? 'Redirecting...' : 'Submit a Complaint'}
                        </button>
                        <p className="text-xs text-center mt-2 text-gray-600">Submit a new complaint to your local authorities.</p>
                    </div>
                </div>
                <p className="text-xs text-center text-gray-400">
                    Select your role to proceed.
                </p>
            </div>
        </div>
    );
};


