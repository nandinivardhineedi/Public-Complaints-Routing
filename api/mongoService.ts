// import type { Complaint } from './../shared/types';
// import { ComplaintStatus, ComplaintCategory, DataSource } from './../shared/types';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// export const saveNewComplaintToDB = async (formData: { complaint_text: string; location: string; category: ComplaintCategory; username: string; }): Promise<any> => {
//     try {
//         const response = await fetch(`${API_BASE_URL}/complaints/submit`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json', },
//             body: JSON.stringify(formData),
//         });
//         if (!response.ok) {
//             const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
//             throw new Error(errorBody.message || `API responded with status: ${response.status}`);
//         }
//         return await response.json();
//     } catch (error) {
//         console.error("Error saving new complaint via API:", error);
//         throw new Error((error as Error).message || "Failed to submit complaint to the database.");
//     }
// };

// export const syncAndSaveComplaintsFromSource = async (source: DataSource, complaintsToSave: any[]): Promise<number> => {
//     try {
//         const response = await fetch(`${API_BASE_URL}/complaints/sync`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json', },
//             body: JSON.stringify({ source, complaints: complaintsToSave }),
//         });
//         if (!response.ok) {
//             const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
//             throw new Error(errorBody.message || `API responded with status: ${response.status}`);
//         }
//         const result = await response.json();
//         return result.newCount || 0; 
//     } catch (error) {
//         console.error(`Error syncing complaints from ${source} via API:`, error);
//         throw new Error((error as Error).message || `Failed to sync complaints from ${source}.`);
//     }
// };

// export const updateComplaintStatusInDB = async (complaintId: string, newStatus: ComplaintStatus): Promise<void> => {
//     try {
//         const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/status`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json', },
//             body: JSON.stringify({ status: newStatus }),
//         });
//         if (!response.ok) {
//             const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
//             throw new Error(errorBody.message || `API responded with status: ${response.status}`);
//         }
//     } catch (error) {
//         console.error(`Error updating status for complaint ${complaintId} via API:`, error);
//         throw new Error((error as Error).message || `Failed to update complaint status in the database.`);
//     }
// };

// export const updateUserProfileInDB = async (userId: string, updatedInfo: { username: string; email: string }): Promise<void> => {
//     try {
//         const response = await fetch(`${API_BASE_URL}/user/${userId}/profile`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(updatedInfo),
//         });
//         if (!response.ok) {
//             const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
//             throw new Error(errorBody.message || `API responded with status: ${response.status}`);
//         }
//     } catch (error) {
//         console.error(`Error updating profile for user ${userId} via API:`, error);
//         throw new Error((error as Error).message || "Failed to update user profile in the database.");
//     }
// };

// export const updateAdminPasswordInDB = async (userId: string, newPassword: string): Promise<void> => {
//     try {
//         const response = await fetch(`${API_BASE_URL}/user/${userId}/password`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ newPassword }),
//         });
//         if (!response.ok) {
//             const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
//             throw new Error(errorBody.message || `API responded with status: ${response.status}`);
//         }
//     } catch (error) {
//         console.error(`Error updating password for user ${userId} via API:`, error);
//         throw new Error((error as Error).message || "Failed to update admin password in the database.");
//     }
// };

// export const fetchAllComplaintsFromDB = async (): Promise<Complaint[]> => {
//     try {
//         const response = await fetch(`${API_BASE_URL}/complaints`);
//         if (!response.ok) {
//             throw new Error(`API responded with status: ${response.status}`);
//         }
//         return await response.json();
//     } catch (error) {
//         console.error("Error fetching all complaints from DB:", error);
//         return [];
//     }
// };


import type { Complaint } from '../src/types';
import { ComplaintStatus, ComplaintCategory, DataSource } from '../src/types';

// Read base URL either from env (relative '/api' for Vercel) or default localhost (for dev)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const saveNewComplaintToDB = async (formData: { complaint_text: string; location: string; category: ComplaintCategory; username: string; }): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/complaints/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorBody.message || `API responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error saving new complaint via API:", error);
    throw new Error((error as Error).message || "Failed to submit complaint to the database.");
  }
};

export const syncAndSaveComplaintsFromSource = async (source: DataSource, complaintsToSave: any[]): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/complaints/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, complaints: complaintsToSave }),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorBody.message || `API responded with status: ${response.status}`);
    }
    const result = await response.json();
    return result.newCount || 0;
  } catch (error) {
    console.error(`Error syncing complaints from ${source} via API:`, error);
    throw new Error((error as Error).message || `Failed to sync complaints from ${source}.`);
  }
};

export const updateComplaintStatusInDB = async (complaintId: string, newStatus: ComplaintStatus): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorBody.message || `API responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error updating status for complaint ${complaintId} via API:`, error);
    throw new Error((error as Error).message || `Failed to update complaint status in the database.`);
  }
};

export const updateUserProfileInDB = async (userId: string, updatedInfo: { username: string; email: string }): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedInfo),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorBody.message || `API responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error updating profile for user ${userId} via API:`, error);
    throw new Error((error as Error).message || "Failed to update user profile in the database.");
  }
};

export const updateAdminPasswordInDB = async (userId: string, newPassword: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorBody.message || `API responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error updating password for user ${userId} via API:`, error);
    throw new Error((error as Error).message || "Failed to update admin password in the database.");
  }
};

export const fetchAllComplaintsFromDB = async (): Promise<Complaint[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/complaints`);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching all complaints from DB:", error);
    return [];
  }
};
