import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ComplaintList } from './components/ComplaintList';
import { MOCK_COMPLAINTS, NEW_MOCK_COMPLAINTS_TO_ADD } from './constants';
import { Sidebar } from './components/Sidebar';
import { SubmitComplaint } from './components/SubmitComplaint';
import { Sources } from './components/Sources';
import { LoginPage } from './components/LoginPage';
import type { Complaint, User } from '../../shared/types';
import { ComplaintCategory, ComplaintStatus, DataSource } from '../../shared/types';
import { NotificationContainer } from './components/NotificationContainer';
import type { Notification } from './components/NotificationContainer';
import { Profile } from './components/Profile';

import { 
  saveNewComplaintToDB, 
  syncAndSaveComplaintsFromSource,
  updateComplaintStatusInDB,
  fetchAllComplaintsFromDB,
  updateUserProfileInDB, 
  updateAdminPasswordInDB 
} from '../api/mongoService'; 

const API_URL = process.env.REACT_APP_API_URL;

export type View = 'dashboard' | 'complaints' | 'sources' | 'submit' | 'profile';
export type UserRole = 'admin' | 'user';

const MOCK_USERS: Record<UserRole, User> = {
  admin: { username: 'Admin User', email: 'admin@civiclens.gov', role: 'admin', password: 'adminpassword123', id: 'MeckkhhEbQtdPXKddLkz' }, 
  user: { username: 'Concerned Citizen', email: 'citizen@example.com', role: 'user' },
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard'); 
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS); 
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const handleLogin = async (role: UserRole, username?: string, password?: string): Promise<boolean> => {
    let success = false;
    if (role === 'admin') {
      const adminUser = MOCK_USERS.admin;
      if (username === adminUser.username && password === adminUser.password) {
        setCurrentUser({ ...adminUser });
        setIsLoggedIn(true);
        setActiveView('dashboard');
        success = true;
      } else {
        addNotification('Invalid admin credentials.', 'info');
        return false;
      }
    } else if (role === 'user') {
      setCurrentUser({ ...MOCK_USERS.user, id: 'USER_FIRESTORE_ID_TO_CREATE' });
      setIsLoggedIn(true);
      setActiveView('submit');
      success = true;
    }

    if (success) {
      try {
        const initialComplaints = await fetchAllComplaintsFromDB();
        const mappedComplaints: Complaint[] = initialComplaints.map(c => ({
          id: c.id, // Firestore document ID for updates
          displayId: c.displayId || c.id, // User-friendly ID
          source: c.source,
          username: c.username,
          location: c.location,
          complaint_text: c.complaint_text,
          timestamp: c.timestamp,
          status: c.status,
          assigned_authority: c.assigned_authority,
          sentiment: c.sentiment,
          category: c.category,
          external_id: c.external_id,
        }));
        setComplaints(mappedComplaints); 
      } catch (e) {
        addNotification("Could not load existing complaints from DB. Using mock data as fallback.", 'info');
        setComplaints(MOCK_COMPLAINTS); 
      }
    }
    return success;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setComplaints([]); 
  };

  const handleAddComplaint = async (formData: { complaint_text: string; location: string; category: ComplaintCategory; username: string; }) => {
    try {
      const response = await saveNewComplaintToDB({
        complaint_text: formData.complaint_text,
        location: formData.location,
        category: formData.category,
        username: formData.username || 'Anonymous Citizen',
      });
      const newComplaint: Complaint = {
        id: response.firestoreId,
        displayId: response.id,
        ...response
      };
      setComplaints(prevComplaints => [newComplaint, ...prevComplaints]);
      addNotification('Thank you! Your complaint has been submitted successfully.');
      if (currentUser?.role === 'admin') {
        setActiveView('dashboard');
      }
    } catch (error) {
      addNotification(`Submission failed: ${(error as Error).message}`, 'info');
    }
  };

  const handleSyncSource = async (source: DataSource): Promise<number> => {
    const complaintsToSend = NEW_MOCK_COMPLAINTS_TO_ADD
      .filter(c => c.source === source && !complaints.some(existing => existing.id === c.id || existing.displayId === c.id))
      .map(c => ({
        complaint_text: c.complaint_text,
        location: c.location,
        category: c.category,
        username: c.username,
        source: c.source,
      }));

    if (complaintsToSend.length === 0) {
      addNotification(`No new complaints found for ${source}.`, 'info');
      return 0;
    }

    try {
      const newCount = await syncAndSaveComplaintsFromSource(source, complaintsToSend);
      if (newCount > 0) {
        addNotification(`Successfully synced ${newCount} new complaints from ${source}! Refreshing data...`);
        const updatedComplaints = await fetchAllComplaintsFromDB();
        const mappedComplaints: Complaint[] = updatedComplaints.map(c => ({
          id: c.id,
          displayId: c.displayId || c.id,
          source: c.source,
          username: c.username,
          location: c.location,
          complaint_text: c.complaint_text,
          timestamp: c.timestamp,
          status: c.status,
          assigned_authority: c.assigned_authority,
          sentiment: c.sentiment,
          category: c.category,
          external_id: c.external_id,
        }));
        setComplaints(mappedComplaints);
      } else {
        addNotification(`No *new* complaints were added from ${source}.`, 'info');
      }
      return newCount;
    } catch (error) {
      addNotification(`Sync failed for ${source}: ${(error as Error).message}`, 'info');
      return 0;
    }
  };
  
  const handleUpdateComplaintStatus = async (complaintId: string, newStatus: ComplaintStatus) => {
    setComplaints(prev => {
      return prev.map(c =>
        c.id === complaintId ? { ...c, status: newStatus } : c
      );
    });
    try {
      await updateComplaintStatusInDB(complaintId, newStatus);
      addNotification(`Success! Complaint status updated.`); 
    } catch (error) {
      addNotification(`Error updating status for ID ${complaintId} in DB. Please refresh.`, 'info');
    }
  };

  const handleUpdateProfile = async (updatedInfo: { username: string; email: string }) => {
    if (currentUser) {
      await updateUserProfileInDB(currentUser.id!, updatedInfo); 
      setCurrentUser({ ...currentUser, ...updatedInfo });
      addNotification('Your profile has been updated successfully!');
    }
  };

  const handleUpdatePassword = async (newPassword: string) => {
    if (currentUser && currentUser.role === 'admin') {
      await updateAdminPasswordInDB(currentUser.id!, newPassword);
      setCurrentUser(prev => prev ? { ...prev, password: newPassword } : null); 
      addNotification('Admin password updated successfully!');
    }
  };

  if (!isLoggedIn || !currentUser) {
    return <LoginPage onLogin={handleLogin} />; 
  }
  
  const userRole = currentUser.role;

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
      {userRole === 'admin' && activeView !== 'submit' && <Sidebar activeView={activeView as Exclude<View, 'submit'>} setActiveView={setActiveView} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeView={activeView} user={currentUser} onLogout={handleLogout} setActiveView={setActiveView}/>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
          {activeView === 'dashboard' && userRole === 'admin' && <Dashboard complaints={complaints} />}
          {activeView === 'complaints' && userRole === 'admin' && <ComplaintList complaints={complaints} onUpdateComplaintStatus={handleUpdateComplaintStatus} />}
          {activeView === 'sources' && userRole === 'admin' && <Sources onSync={handleSyncSource} />}
          {activeView === 'submit' && <SubmitComplaint onAddComplaint={handleAddComplaint} userRole={userRole}/>}
          {activeView === 'profile' && <Profile user={currentUser} onUpdateProfile={handleUpdateProfile} onUpdatePassword={handleUpdatePassword} />}
        </main>
      </div>
    </div>
  );
};

export default App;
