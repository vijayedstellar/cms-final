# CMS Dashboard Module Integration Guide

This guide explains how to integrate the CMS Dashboard module into your existing CMS project.

## Current Project Structure

```
your-cms-project/
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx                    # Authentication component
│   │   └── ProtectedRoute.tsx               # Route protection wrapper
│   ├── hooks/
│   │   └── useAuth.ts                       # Authentication hook
│   ├── lib/
│   │   ├── firebase.ts                      # Firebase configuration
│   │   └── supabase.ts                      # Supabase configuration (optional)
│   ├── modules/
│   │   └── dashboard/                       # Main dashboard module
│   │       ├── components/
│   │       │   ├── Dashboard.tsx            # Main dashboard container
│   │       │   ├── Header.tsx               # Top navigation bar
│   │       │   ├── Sidebar.tsx              # Navigation sidebar
│   │       │   ├── MainContent.tsx          # Content area router
│   │       │   ├── PageView.tsx             # Pages management interface
│   │       │   ├── ComponentView.tsx        # Components management interface
│   │       │   └── SettingsView.tsx         # Settings and user management
│   │       ├── hooks/
│   │       │   └── useDashboard.ts          # Dashboard state management
│   │       ├── services/
│   │       │   ├── dashboardService.ts      # Main API service
│   │       │   └── emailService.ts          # Email service (optional)
│   │       ├── types/
│   │       │   └── index.ts                 # TypeScript definitions
│   │       ├── utils/
│   │       │   └── navigation.ts            # Navigation utilities
│   │       ├── tests/
│   │       │   ├── Dashboard.test.tsx       # Component tests
│   │       │   └── useDashboard.test.ts     # Hook tests
│   │       ├── index.ts                     # Module exports
│   │       └── README.md                    # Module documentation
│   ├── App.tsx                              # Main app component
│   ├── main.tsx                             # App entry point
│   └── index.css                            # Global styles
├── supabase/                                # Supabase configuration (optional)
│   └── migrations/
│       ├── 20250811193753_flat_lake.sql     # Initial CMS users table
│       └── 20250811195340_young_mouse.sql   # Enhanced CMS users table
├── public/
├── package.json                             # Dependencies
├── tailwind.config.js                       # Tailwind CSS config
├── vite.config.ts                           # Vite configuration
├── firestore.rules                          # Firestore security rules
├── firestore-rules.txt                      # Alternative rules format
├── FIRESTORE_FIX_INSTRUCTIONS.md            # Troubleshooting guide
├── netlify.toml                             # Netlify deployment config
├── .env.example                             # Environment variables template
└── README.md                                # Project documentation
```

## Integration Steps

### Step 1: Copy Core Files

#### 1.1 Authentication System
Copy these files to your project:

```bash
# Authentication components
your-cms-project/src/components/
├── LoginForm.tsx
└── ProtectedRoute.tsx

# Authentication hook
your-cms-project/src/hooks/
└── useAuth.ts
```

#### 1.2 Firebase Configuration
```bash
# Firebase setup
your-cms-project/src/lib/
└── firebase.ts
```

**Important**: Update `src/lib/firebase.ts` with your Firebase project credentials:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Step 2: Copy Dashboard Module

#### 2.1 Complete Dashboard Module
Copy the entire dashboard module:

```bash
your-cms-project/src/modules/
└── dashboard/
    ├── components/
    │   ├── Dashboard.tsx
    │   ├── Header.tsx
    │   ├── Sidebar.tsx
    │   ├── MainContent.tsx
    │   ├── PageView.tsx
    │   ├── ComponentView.tsx
    │   └── SettingsView.tsx
    ├── hooks/
    │   └── useDashboard.ts
    ├── services/
    │   ├── dashboardService.ts
    │   └── emailService.ts
    ├── types/
    │   └── index.ts
    ├── utils/
    │   └── navigation.ts
    ├── tests/
    │   ├── Dashboard.test.tsx
    │   └── useDashboard.test.ts
    ├── index.ts
    └── README.md
```

### Step 3: Update Main App Files

#### 3.1 Update App.tsx
Replace or update your main App component:

```typescript
import React from 'react';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './modules/dashboard';

function App() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

export default App;
```

#### 3.2 Update main.tsx
Ensure your entry point includes the CSS:

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

#### 3.3 Update index.css
Add Tailwind CSS imports:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 4: Configuration Files

#### 4.1 Package.json Dependencies
Add these dependencies to your `package.json`:

```json
{
  "dependencies": {
    "firebase": "^12.1.0",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}
```

#### 4.2 Tailwind Configuration
Copy `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### 4.3 PostCSS Configuration
Copy `postcss.config.js`:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

#### 4.4 Vite Configuration
Copy `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

### Step 5: Firebase Setup

#### 5.1 Firestore Security Rules
Copy `firestore.rules` to your Firebase project:

```bash
your-cms-project/
└── firestore.rules
```

Deploy the rules to Firebase:
```bash
firebase deploy --only firestore:rules
```

#### 5.2 Environment Variables
Create `.env` file based on `.env.example`:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 6: Database Setup (Choose One)

#### Option A: Firebase Firestore
1. Enable Firestore in Firebase Console
2. Enable Email/Password authentication
3. Deploy security rules
4. Create initial admin user following `FIRESTORE_FIX_INSTRUCTIONS.md`

#### Option B: Supabase (Optional)
If you prefer Supabase:

```bash
your-cms-project/supabase/
└── migrations/
    ├── 20250811193753_flat_lake.sql
    └── 20250811195340_young_mouse.sql
```

Copy `src/lib/supabase.ts` and run migrations.

### Step 7: Documentation Files

Copy these helpful files:

```bash
your-cms-project/
├── README.md                                # Main project documentation
├── FIRESTORE_FIX_INSTRUCTIONS.md           # Troubleshooting guide
└── src/modules/dashboard/README.md          # Dashboard module docs
```

### Step 8: Deployment (Optional)

#### 8.1 Netlify
Copy `netlify.toml` for Netlify deployment:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Installation Commands

After copying all files, run:

```bash
# Install dependencies
npm install

# Install additional dependencies if needed
npm install firebase lucide-react

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer

# Start development server
npm run dev
```

## Key Integration Points

### 1. Authentication Flow
- `LoginForm.tsx` handles user login
- `ProtectedRoute.tsx` protects dashboard routes
- `useAuth.ts` manages authentication state

### 2. Dashboard Module
- Self-contained in `src/modules/dashboard/`
- Exports main `Dashboard` component
- Includes all sub-components and services

### 3. Firebase Integration
- `firebase.ts` configures Firebase
- `dashboardService.ts` handles all API calls
- Firestore rules control access permissions

### 4. User Management
- Admin users can manage all users
- Non-admin users can update their own profiles
- Role-based access control throughout

## Troubleshooting

1. **Permission Errors**: Follow `FIRESTORE_FIX_INSTRUCTIONS.md`
2. **UID Mismatch**: Ensure Firestore document ID matches Firebase Auth UID
3. **Missing Dependencies**: Check `package.json` for all required packages
4. **Build Errors**: Ensure all TypeScript types are properly imported

## Next Steps

1. Copy all files to your project
2. Update Firebase configuration
3. Install dependencies
4. Set up Firebase/Supabase database
5. Create initial admin user
6. Test authentication and user management
7. Customize components as needed

The dashboard module is designed to be modular and can be easily integrated into existing CMS projects while maintaining clean separation of concerns.