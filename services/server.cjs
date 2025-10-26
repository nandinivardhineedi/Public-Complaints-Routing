// // --- START OF SERVER.CJS (Switching to CommonJS for maximum compatibility) ---
// const express = require('express');
// const cors = require('cors');
// const admin = require('firebase-admin');
// const functions = require('firebase-functions'); // Included as per your log, though not used below

// // IMPORTANT: Ensure 'firebase-admin-key.json' is in this 'functions' directory.
// let db;
// try {
//     const serviceAccount = require('./firebase-admin-key.json'); 
//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount)
//     });
//     db = admin.firestore();
// } catch (error) {
//     console.error("❌ CRITICAL ERROR: Firebase Admin SDK Initialization Failed.");
//     console.error("Ensure 'firebase-admin-key.json' exists in this directory and is valid.");
//     process.exit(1);
// }

// const complaintsCollectionRef = db.collection('complaints');
// const countersCollectionRef = db.collection('counters');
// const usersCollectionRef = db.collection('users'); // Reference for user updates

// const app = express();
// const PORT = process.env.PORT || 3000; // Backend runs on 3000

// // --- Middleware ---
// app.use(cors({
//     origin: ['http://localhost:5173'], // Frontend URL
//     methods: ['GET', 'POST', 'PATCH']
// }));
// app.use(express.json());

// // --- Utility: Sequence Counter Logic (Revised for simplicity/atomicity) ---
// const getNextSequenceValue = async (sequenceName) => {
//     const counterRef = countersCollectionRef.doc(sequenceName);
//     // Atomically increment and get the new value
//     await counterRef.set(
//       { sequence_value: admin.firestore.FieldValue.increment(1) },
//       { merge: true }
//     );
//     const updatedDoc = await counterRef.get();
//     // Format the value as CXXX (e.g., 1 -> C001)
//     return `C${(updatedDoc.data().sequence_value).toString().padStart(3, '0')}`;
// };

// // --- API Routes ---

// // GET /api/complaints: Fetch all complaints
// app.get('/api/complaints', async (req, res) => {
//     try {
//         const snapshot = await complaintsCollectionRef.orderBy('timestamp', 'desc').get();
//         const complaints = snapshot.docs.map(doc => ({
//             id: doc.id, // Firestore Document ID
//             ...doc.data(),
//         }));
//         res.json(complaints);
//     } catch (error) {
//         console.error("Error fetching complaints from Firestore:", error);
//         res.status(500).json({ message: "Failed to retrieve complaints." });
//     }
// });


// // POST /api/complaints/submit: Handle single user submission
// app.post('/api/complaints/submit', async (req, res) => {
//     const formData = req.body;
//     const username = formData.username || 'Anonymous Citizen';
//     const timestamp = new Date().toISOString();

//     try {
//         const displayId = await getNextSequenceValue('complaintId'); 
//         const newComplaintData = {
//             id: displayId, // Sequential ID for display (C001, C002, ...)
//             source: 'MunicipalPortal', 
//             username: username,
//             location: formData.location,
//             complaint_text: formData.complaint_text,
//             timestamp: timestamp,
//             status: 'Pending', 
//             assigned_authority: 'Unassigned',
//             sentiment: 'Neutral', 
//             category: formData.category,
//         };

//         const docRef = await complaintsCollectionRef.add(newComplaintData);
        
//         res.status(201).json({
//             firestoreId: docRef.id, // The internal Firestore ID for linking updates
//             id: displayId,         // The sequential ID for display in state
//             ...newComplaintData
//         }); 
//     } catch (error) {
//         console.error("Error submitting complaint to Firestore:", error);
//         res.status(500).json({ message: "Failed to submit complaint to Firestore." });
//     }
// });

// // POST /api/complaints/sync: Handle bulk sync from external sources
// app.post('/api/complaints/sync', async (req, res) => {
//     const { source, complaints } = req.body;
    
//     // *** CRITICAL FIX: Sanitize source name to remove characters like '/' ***
//     const sanitizedSource = source.replace(/[^a-zA-Z0-9]/g, ''); 
//     const sequenceName = `sync_${sanitizedSource}Id`; 
//     let syncCounterValue = 0;

//     try {
//         const counterRef = countersCollectionRef.doc(sequenceName);
//         const counterDoc = await counterRef.get();
//         syncCounterValue = counterDoc.exists ? counterDoc.data().sequence_value : 0;
        
//         const batch = db.batch();

//         for (const c of complaints) {
//             syncCounterValue++; 
//             // Use the first letter of the sanitized source for the prefix (T for Twitter)
//             const displayId = `${sanitizedSource.substring(0, 1)}${syncCounterValue.toString().padStart(3, '0')}`; 
            
//             const docRef = complaintsCollectionRef.doc(); // Get a new internal Firestore Document ID reference
//             batch.set(docRef, {
//                 id: displayId, // Sequential ID for display
//                 source: source, 
//                 username: c.username || 'External User',
//                 location: c.location,
//                 complaint_text: c.complaint_text,
//                 timestamp: new Date().toISOString(),
//                 status: 'Pending',
//                 assigned_authority: 'Unassigned',
//                 sentiment: 'Neutral',
//                 category: c.category,
//             });
//         }
        
//         if (complaints.length > 0) {
//             await batch.commit();
//             await counterRef.set({ sequence_value: syncCounterValue });
//         }

//         res.json({ message: `Sync complete for ${source}.`, newCount: complaints.length });
//     } catch (error) {
//         console.error(`Error syncing complaints from ${source}:`, error);
//         res.status(500).json({ message: `Failed to sync complaints from ${source}.` });
//     }
// });

// // PATCH /api/complaints/:id/status: Update a single complaint status
// app.patch('/api/complaints/:id/status', async (req, res) => {
//     const { id } = req.params; // This MUST be the internal Firestore Document ID
//     const { status } = req.body;

//     if (!status || !['Pending', 'InReview', 'Resolved'].includes(status)) {
//         return res.status(400).json({ message: "Invalid or missing status." });
//     }

//     try {
//         const docRef = complaintsCollectionRef.doc(id);
//         const doc = await docRef.get();
        
//         if (!doc.exists) {
//             return res.status(404).json({ message: `Complaint with Firestore ID ${id} not found.` });
//         }

//         await docRef.update({ status: status });
//         res.json({ message: `Complaint ${id} status updated to ${status}.` });
//     } catch (error) {
//         console.error(`Error updating status for Firestore ID ${id}:`, error);
//         res.status(500).json({ message: `Failed to update status for complaint ${id}.` });
//     }
// });

// // PATCH /api/user/:id/profile: Update user info (username/email)
// app.patch('/api/user/:id/profile', async (req, res) => {
//     const { id } = req.params;
//     const { username, email } = req.body;

//     if (!id || id === 'undefined') {
//         return res.status(400).json({ message: "User ID is missing." });
//     }

//     try {
//         const userRef = usersCollectionRef.doc(id); 
//         const doc = await userRef.get();

//         if (!doc.exists) {
//             return res.status(404).json({ message: `User ID ${id} not found.` });
//         }

//         const updates = {};
//         if (username) updates.username = username;
//         if (email) updates.email = email;

//         await userRef.update(updates);
//         res.json({ message: `User ${id} profile updated successfully.` });
//     } catch (error) {
//         console.error(`Error updating profile for ${id}:`, error);
//         res.status(500).json({ message: "Failed to update user profile." });
//     }
// });

// // PATCH /api/user/:id/password: Update admin password
// app.patch('/api/user/:id/password', async (req, res) => {
//     const { id } = req.params;
//     const { newPassword } = req.body;

//     if (!id || id === 'undefined') {
//         return res.status(400).json({ message: "User ID is missing." });
//     }
//     if (!newPassword) {
//         return res.status(400).json({ message: "New password is required." });
//     }

//     try {
//         const userRef = usersCollectionRef.doc(id); 
//         const doc = await userRef.get();

//         if (!doc.exists) {
//             return res.status(404).json({ message: `User ID ${id} not found.` });
//         }

//         await userRef.update({ password: newPassword }); 
//         res.json({ message: `User ${id} password updated successfully.` });
//     } catch (error) {
//         console.error(`Error updating password for ${id}:`, error);
//         res.status(500).json({ message: "Failed to update password." });
//     }
// });


// // Start the Express server
// app.listen(PORT, () => {
//     console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables from .env if present
dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize Firestore using ENV secret
let db;
try {
    const rawKey = process.env.FIREBASE_ADMIN_KEY;
    if (!rawKey) throw new Error("FIREBASE_ADMIN_KEY is missing or empty");

    // Parse JSON and fix private_key line breaks
    const serviceAccount = JSON.parse(rawKey);
    if (serviceAccount.private_key)
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log("✅ Firebase Admin SDK initialized");
} catch (error) {
    console.error("❌ Firebase Admin SDK Init Failed:", error);
    process.exit(1);
}

const complaintsCollectionRef = db.collection('complaints');
const countersCollectionRef = db.collection('counters');
const usersCollectionRef = db.collection('users');

const app = express();

// Middleware config
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PATCH']
}));
app.use(express.json());

// Utility: Sequence Counter
const getNextSequenceValue = async (sequenceName) => {
    const counterRef = countersCollectionRef.doc(sequenceName);
    await counterRef.set({
        sequence_value: admin.firestore.FieldValue.increment(1)
    }, { merge: true });
    const updatedDoc = await counterRef.get();
    return `C${(updatedDoc.data().sequence_value).toString().padStart(3, '0')}`;
};

// API ROUTES

// GET /api/complaints: Fetch all complaints
app.get('/api/complaints', async (req, res) => {
    try {
        const snapshot = await complaintsCollectionRef.orderBy('timestamp', 'desc').get();
        const complaints = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve complaints." });
    }
});

// POST /api/complaints/submit: Handle single submission
app.post('/api/complaints/submit', async (req, res) => {
    const formData = req.body;
    const username = formData.username || 'Anonymous Citizen';
    const timestamp = new Date().toISOString();

    try {
        const displayId = await getNextSequenceValue('complaintId');
        const newComplaintData = {
            id: displayId,
            source: 'MunicipalPortal',
            username,
            location: formData.location,
            complaint_text: formData.complaint_text,
            timestamp,
            status: 'Pending',
            assigned_authority: 'Unassigned',
            sentiment: 'Neutral',
            category: formData.category,
        };
        const docRef = await complaintsCollectionRef.add(newComplaintData);
        res.status(201).json({ firestoreId: docRef.id, ...newComplaintData });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit complaint." });
    }
});

// POST /api/complaints/sync: Handle bulk sync
app.post('/api/complaints/sync', async (req, res) => {
    const { source, complaints } = req.body;
    const sanitizedSource = source.replace(/[^a-zA-Z0-9]/g, '');
    const sequenceName = `sync_${sanitizedSource}Id`;
    let syncCounterValue = 0;

    try {
        const counterRef = countersCollectionRef.doc(sequenceName);
        const counterDoc = await counterRef.get();
        syncCounterValue = counterDoc.exists ? counterDoc.data().sequence_value : 0;
        const batch = db.batch();

        for (const c of complaints) {
            syncCounterValue++;
            const displayId = `${sanitizedSource[0]}${syncCounterValue.toString().padStart(3, '0')}`;
            const docRef = complaintsCollectionRef.doc();
            batch.set(docRef, {
                id: displayId,
                source,
                username: c.username || 'External User',
                location: c.location,
                complaint_text: c.complaint_text,
                timestamp: new Date().toISOString(),
                status: 'Pending',
                assigned_authority: 'Unassigned',
                sentiment: 'Neutral',
                category: c.category,
            });
        }

        if (complaints.length > 0) {
            await batch.commit();
            await counterRef.set({ sequence_value: syncCounterValue });
        }

        res.json({ message: `Sync complete for ${source}.`, newCount: complaints.length });
    } catch (error) {
        res.status(500).json({ message: `Failed to sync complaints.` });
    }
});

// PATCH /api/complaints/:id/status: Update status
app.patch('/api/complaints/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'InReview', 'Resolved'].includes(status)) {
        return res.status(400).json({ message: "Invalid status." });
    }

    try {
        const docRef = complaintsCollectionRef.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ message: `Complaint ${id} not found.` });

        await docRef.update({ status });
        res.json({ message: `Complaint ${id} status updated.` });
    } catch (error) {
        res.status(500).json({ message: `Failed to update status.` });
    }
});

// PATCH /api/user/:id/profile: Update user info (username/email)
app.patch('/api/user/:id/profile', async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;

    if (!id || id === 'undefined') {
        return res.status(400).json({ message: "User ID is missing." });
    }

    try {
        const userRef = usersCollectionRef.doc(id);
        const doc = await userRef.get();
        if (!doc.exists) return res.status(404).json({ message: `User ${id} not found.` });

        const updates = {};
        if (username) updates.username = username;
        if (email) updates.email = email;

        await userRef.update(updates);
        res.json({ message: `User ${id} profile updated.` });
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile." });
    }
});

// PATCH /api/user/:id/password: Update password
app.patch('/api/user/:id/password', async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!id || id === 'undefined') {
        return res.status(400).json({ message: "User ID is missing." });
    }
    if (!newPassword) {
        return res.status(400).json({ message: "New password is required." });
    }

    try {
        const userRef = usersCollectionRef.doc(id);
        const doc = await userRef.get();
        if (!doc.exists) return res.status(404).json({ message: `User ${id} not found.` });

        await userRef.update({ password: newPassword });
        res.json({ message: `User ${id} password updated.` });
    } catch (error) {
        res.status(500).json({ message: "Failed to update password." });
    }
});

// Server start
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
