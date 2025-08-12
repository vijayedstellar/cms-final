# CMS Dashboard

A modern, responsive CMS dashboard built with React, TypeScript, and Firebase.

## 🚀 Features

- **User Authentication** - Secure login system with role-based access
- **Role-Based Access Control** - Different permissions for administrators, editors, and authors
- **User Management** - Create, edit, delete, and manage user accounts (admin only)
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Data** - All data synced with Firebase Firestore
- **Modern UI** - Clean, professional interface with Tailwind CSS

## 🔧 Setup Instructions

### 1. Firebase Configuration

You need to replace the placeholder Firebase configuration in `src/lib/firebase.ts` with your actual Firebase project details:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings → General → Your apps
4. Add a web app or select existing one
5. Copy the configuration object
6. Replace the placeholder values in `src/lib/firebase.ts`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

### 2. Firebase Setup

1. **Enable Authentication:**
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable "Email/Password" provider

2. **Create Firestore Database:**
   - Go to Firebase Console → Firestore Database
   - Create database in production mode
   - Set up security rules (or start in test mode)

3. **Create Initial Admin User:**
   - Go to Firebase Console → Authentication → Users
   - Add a user manually with email and password
   - Note the User UID

4. **Add User to Firestore:**
   - Go to Firestore Database
   - Create a collection called `cms_users`
   - Add a document with the User UID as document ID:
   ```json
   {
     "name": "Admin User",
     "email": "admin@cms.com",
     "role": "administrator",
     "status": "active",
     "created_at": "2024-01-01T00:00:00.000Z",
     "updated_at": "2024-01-01T00:00:00.000Z",
     "last_login": null
   }
   ```

## 🎯 User Roles & Permissions

### Administrator
- Full access to all features
- Can create, edit, delete users
- Can approve pending users
- Can reset passwords
- Access to all dashboard sections

### Editor/Author
- Can edit their own profile
- Can reset their own password
- Limited access to dashboard features
- Cannot manage other users

## 🔐 Demo Credentials

Once you set up your Firebase project and create users, you can use:
- **Admin**: Your admin email / password
- **Editor**: Any editor user you create

## 🛠 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── modules/dashboard/          # Dashboard module
│   ├── components/            # React components
│   ├── hooks/                # Custom hooks
│   ├── services/             # API services
│   ├── types/                # TypeScript types
│   └── utils/                # Utility functions
├── lib/                      # Firebase configuration
└── App.tsx                   # Main app component
```

## 🚀 Deployment

The app is configured for Netlify deployment:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects are handled by `netlify.toml`

## 📝 Notes

- All user data is stored in Firebase Firestore
- Authentication is handled by Firebase Auth
- No local storage is used - all data is fetched fresh from Firebase
- The app requires active internet connection to function

## 🔒 Security

- Users must be authenticated to access the dashboard
- Role-based access control prevents unauthorized actions
- Only active users can sign in
- Administrators cannot delete themselves (prevents lockout)

## 🆘 Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure you've replaced the placeholder Firebase configuration with your actual project details
- Verify your Firebase project has Authentication enabled
- Check that Email/Password provider is enabled in Firebase Auth

### "User not found" or login issues
- Ensure you've created the user in both Firebase Auth and Firestore
- Verify the user's status is set to "active" in Firestore
- Check that the document ID in Firestore matches the User UID from Firebase Auth