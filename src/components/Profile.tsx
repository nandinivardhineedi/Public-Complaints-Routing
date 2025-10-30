import React, { useState, useEffect } from 'react';
import type { User } from './../types';

interface ProfileProps {
  user: User;
  onUpdateProfile: (details: { username: string; email: string; }) => Promise<void>;
  onUpdatePassword: (newPassword: string) => Promise<void>;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateProfile, onUpdatePassword }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<string>('');


  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordError(''); // Clear errors on input change
    setPasswordSuccess(''); // Clear success on input change
  };

  const handleInfoSubmit = async (e: React.FormEvent) => { // Made async
    e.preventDefault();
    setIsSaving(true);
    try {
        await onUpdateProfile(formData);
    } catch (error) {
        // Notification handled in App.tsx
    } finally {
        setIsSaving(false);
    }
  };
  
   const handlePasswordSubmit = async (e: React.FormEvent) => { // Made async
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setIsUpdatingPassword(true);

    if (user.role !== 'admin') {
      setPasswordError("Password change is only supported for admin accounts in this demo.");
      setIsUpdatingPassword(false);
      return;
    }

    if (!user.password || passwordData.currentPassword !== user.password) {
        setPasswordError("Current password is incorrect.");
        setIsUpdatingPassword(false);
        return;
    }

    if (passwordData.newPassword.length < 8) {
        setPasswordError("New password must be at least 8 characters long.");
        setIsUpdatingPassword(false);
        return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError("New passwords do not match.");
        setIsUpdatingPassword(false);
        return;
    }

    if (passwordData.newPassword === user.password) {
        setPasswordError("New password cannot be the same as the current password.");
        setIsUpdatingPassword(false);
        return;
    }
    
    try {
        await onUpdatePassword(passwordData.newPassword); 
        setPasswordSuccess("Password changed successfully!");
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordSuccess(''), 5000); 
    } catch (error) {
        setPasswordError(`Update failed: ${(error as Error).message}`);
    } finally {
        setIsUpdatingPassword(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and password.</p>
      </div>

      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">Personal Information</h2>
        <form onSubmit={handleInfoSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleInfoChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInfoChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Change Password */}
       <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {passwordError && (
              <p className="text-red-600 text-sm mt-2" role="alert" aria-live="assertive">{passwordError}</p>
          )}
          {passwordSuccess && (
              <p className="text-green-600 text-sm mt-2" role="status" aria-live="assertive">{passwordSuccess}</p>
          )}
           <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full sm:w-auto flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400"
            >
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};