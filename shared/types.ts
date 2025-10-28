export enum ComplaintStatus {
  Pending = 'Pending',
  InReview = 'InReview',
  Resolved = 'Resolved',
}

export enum ComplaintCategory {
  Infrastructure = 'Infrastructure',
  Sanitation = 'Sanitation',
  Safety = 'Safety',
  PublicTransport = 'Public Transport',
  Parks = 'Parks & Recreation',
  Noise = 'Noise Complaint',
}

export enum Sentiment {
  Positive = 'Positive',
  Negative = 'Negative',
  Neutral = 'Neutral',
}

export enum DataSource {
    Twitter = 'Twitter/X',
    Reddit = 'Reddit',
    MunicipalPortal = 'Municipal Portal',
    CommunityForum = 'Community Forum',
}

export interface Complaint {
  // PRIMARY KEY: Internal Firestore Document ID (the random string)
  id: string; 
  
  // NEW: Display ID (e.g., 'C001', 'T001')
  displayId?: string; 
  
  source: DataSource;
  username: string;
  location: string;
  complaint_text: string;
  timestamp: string;
  status: ComplaintStatus;
  assigned_authority: string;
  sentiment: Sentiment;
  category: ComplaintCategory;
  external_id?: string; 
}

export interface User {
  username: string;
  email: string;
  role: 'admin' | 'user';
  password?: string; 
  id?: string; // Firestore ID - CRITICAL for profile updates
}

