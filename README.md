# 🏙️ CivicLens: AI Complaint Analysis Platform

## 🚀 Project Overview

CivicLens is an AI-powered public service complaint analysis and routing system designed to streamline civic issue management. By aggregating citizen feedback from multiple sources (e.g., mock social media feeds, municipal portals), the platform enables city administrators to:

- Automatically analyze sentiment and categorize complaints
- Prioritize critical issues for faster resolution
- Visualize insights through an intuitive dashboard

The goal is to enhance responsiveness and transparency in civic governance using intelligent automation.

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js (Express)
- **Database**: Firebase Firestore
- **AI Integration**: Sentiment analysis and summarization via backend logic

## 📦 Prerequisites

Before setting up the project, ensure the following:

- **Node.js**: Recommended version v18+ or v20+
- **Firebase**:
  - Create a Firebase project
  - Enable Firestore
  - Generate and download a Service Account JSON key

## ⚙️ Setup Instructions

### 1️⃣ Backend Setup

The backend handles complaint storage and AI-driven summaries.

```bash
# Create backend folder
mkdir api
mv firebase-admin-key.json api/

# Initialize backend dependencies
cd api
npm install express firebase-admin firebase-functions cors
cd ..
```

> 🔧 Ensure any additional dependencies from your original `package.json` are also installed.

### 2️⃣ Frontend Setup

```bash
# Install frontend dependencies
npm install
```

Update the API base URL in `services/mongoService.ts`:

```ts
const API_BASE_URL = "http://localhost:3000/api";
```

---

## 🧪 Running Locally

You’ll need two terminals to run the backend and frontend concurrently.

### ▶️ Start Backend (Terminal 1)

```bash
cd api
node server.cjs  # or node index.js depending on your setup
```

> Server will start on `http://localhost:3000`

### ▶️ Start Frontend (Terminal 2)

```bash
npm run dev
```

> Frontend will launch on `http://localhost:5173`

---

## 🌐 Access the App

Open your browser and navigate to:

```
http://localhost:5173
```

You should see the CivicLens dashboard interface.

---

## 📸 Screenshots

Below are sample screenshots of the platform in action:

<img width="851" height="918" alt="image" src="https://github.com/user-attachments/assets/227fa091-3b69-481b-bac5-e4749057f2d5" />
<img width="1878" height="877" alt="image" src="https://github.com/user-attachments/assets/f65c9d92-d07c-47c5-8c1a-11ad861a3c18" />
<img width="1852" height="875" alt="image" src="https://github.com/user-attachments/assets/c9fc207e-a521-41c4-82ef-47f4c5d9c25b" />
<img width="1875" height="865" alt="image" src="https://github.com/user-attachments/assets/392c4f50-e9da-4da3-b44f-58f7661b611d" />
<img width="1875" height="865" alt="image" src="https://github.com/user-attachments/assets/f6cfccdf-7324-4500-b090-8cf88992f89b" />
<img width="1881" height="884" alt="image" src="https://github.com/user-attachments/assets/9371ec39-7ad8-40cb-a221-c793b875b959" />
<img width="1874" height="874" alt="image" src="https://github.com/user-attachments/assets/05fa8bb6-9622-43bf-9d5c-895a74f8ebea" />
