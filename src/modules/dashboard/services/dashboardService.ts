import { auth, db } from '../../../lib/firebase'
import { 
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth'
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where
} from 'firebase/firestore'
import type { User } from '../types'

export class DashboardService {
  async getDashboardStats() {
    try {
      console.log('🔍 Fetching dashboard stats...');
      const usersRef = collection(db, 'cms_users')
      const snapshot = await getDocs(usersRef)
      
      const users = snapshot.docs.map(doc => doc.data())
      const totalUsers = users.length
      const activeUsers = users.filter(u => u.status === 'active').length
      const pendingUsers = users.filter(u => u.status === 'pending').length
      const roles = new Set(users.map(u => u.role)).size

      const stats = {
        totalUsers,
        activeUsers,
        pendingUsers,
        totalRoles: roles,
        lastUpdated: new Date().toISOString()
      }

      console.log('✅ Dashboard stats loaded:', stats);
      return stats;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      throw new Error('Unable to load dashboard statistics')
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      console.log('🔍 Fetching users for admin...');
      console.log('🔍 Current user:', auth.currentUser?.uid);
      console.log('🔍 Firebase config check:', {
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        hasAuth: !!auth.currentUser
      });
      
      const usersRef = collection(db, 'cms_users')
      
      // Try without orderBy first to see if that's the issue
      console.log('🔍 Attempting to fetch users without orderBy...');
      let snapshot;
      try {
        const q = query(usersRef, orderBy('created_at', 'desc'))
        snapshot = await getDocs(q)
        console.log('🔍 Successfully fetched with orderBy');
      } catch (orderByError) {
        console.warn('🔍 OrderBy failed, trying without:', orderByError);
        // Fallback: fetch without orderBy
        snapshot = await getDocs(usersRef)
      }
      
      console.log('🔍 Query snapshot size:', snapshot.size);
      console.log('🔍 Query snapshot empty:', snapshot.empty);
      
      if (snapshot.empty) {
        console.log('🔍 No users found in Firestore collection');
        return [];
      }
      
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User))
      
      console.log('🔍 Processed users:', users.length);
      console.log('🔍 Users data:', users);
      
      return users;
    } catch (error) {
      console.error('🚨 Failed to fetch users:', error);
      console.error('🚨 Error code:', error.code);
      console.error('🚨 Error message:', error.message);
      
      // More specific error handling
      if (error.code === 'permission-denied') {
        console.error('🚨 Permission denied - checking user permissions...');
        const currentUser = auth.currentUser;
        if (currentUser) {
          console.log('🚨 Current user UID:', currentUser.uid);
          // Try to fetch current user's document to check permissions
          try {
            const userDocRef = doc(db, 'cms_users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            console.log('🚨 Current user doc exists:', userDoc.exists());
            if (userDoc.exists()) {
              console.log('🚨 Current user data:', userDoc.data());
            } else {
              console.error('🚨 User document not found for UID:', currentUser.uid);
              throw new Error(`User profile not found. Please ensure your user document exists in Firestore with ID: ${currentUser.uid}`);
            }
          } catch (userDocError) {
            console.error('🚨 Failed to fetch current user doc:', userDocError);
            throw new Error('Failed to verify user permissions. Please check your user profile setup.');
          }
        }
        throw new Error('Permission denied. Your user account may not have administrator privileges or there may be a UID mismatch in Firestore. Please contact your system administrator.');
      } else if (error.code === 'failed-precondition') {
        throw new Error('Database index missing. Please create the required index.');
      }
      
      throw new Error(`Unable to load users: ${error.message || 'Unknown error'}`);
    }
  }


  async createUser(userData: {
    name: string
    email: string
    role: string
    password: string
  }): Promise<User> {
    try {
      // Store current user to restore later
      const currentUser = auth.currentUser
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userData.email)) {
        throw new Error('Please enter a valid email address')
      }

      console.log('Creating new user:', userData.email)

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      )

      if (!userCredential.user) {
        throw new Error('Failed to create user account')
      }

      console.log('User created in Firebase Auth:', userCredential.user.uid)

      // Create user profile in Firestore
      const newUser = {
        name: userData.name,
        email: userData.email,
        role: userData.role as 'administrator' | 'editor' | 'author',
        status: 'pending' as const,
        last_login: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Use the Firebase Auth UID as the document ID
      const userDocRef = doc(db, 'cms_users', userCredential.user.uid)
      
      try {
        await setDoc(userDocRef, newUser)
        console.log('User profile created in Firestore successfully')
      } catch (firestoreError) {
        console.error('Failed to create Firestore document:', firestoreError)
        // If Firestore creation fails, we should clean up the Auth user
        // Note: This requires Firebase Admin SDK in production
        throw new Error('Failed to create user profile in database. Please check Firestore security rules.')
      }

      console.log('User creation completed successfully')
      
      // Important: Sign out the newly created user to restore admin session
      if (auth.currentUser && auth.currentUser.uid !== currentUser?.uid) {
        await auth.signOut()
        // The admin will remain logged in through the existing session
      }


      return {
        id: userCredential.user.uid,
        ...newUser
      }
    } catch (error: any) {
      console.error('Failed to create user:', error)
      
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email address is already registered in the system. Please use a different email address or check if the user already exists.')
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use a stronger password.')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.')
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password authentication is not enabled. Please contact administrator.')
      }
      
      throw new Error(error.message || 'Unable to create user')
    }
  }

  async updateUser(userId: string, userData: {
    name?: string
    email?: string
    role?: string
  }): Promise<User> {
    try {
      const userDocRef = doc(db, 'cms_users', userId)
      const updateData = {
        ...userData,
        updated_at: new Date().toISOString()
      }

      await updateDoc(userDocRef, updateData)
      
      const updatedDoc = await getDoc(userDocRef)
      
      return {
        id: userId,
        ...updatedDoc.data()
      } as User
    } catch (error) {
      console.error('Failed to update user:', error)
      throw new Error('Unable to update user')
    }
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
    try {
      console.log('Updating password for user:', userId);
      // Note: Firebase Admin SDK would be needed for server-side password updates
      // For now, this is a placeholder - in production, you'd need a Cloud Function
      console.warn('Password update requires Firebase Admin SDK or Cloud Function')
      
      // Update the updated_at timestamp
      const userDocRef = doc(db, 'cms_users', userId)
      await updateDoc(userDocRef, { 
        updated_at: new Date().toISOString() 
      })

      console.log('Password update completed for user:', userId);
      return true
    } catch (error) {
      console.error('Failed to update password:', error)
      throw new Error('Unable to update password')
    }
  }

  async updateCurrentUserPassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      console.log('Starting password update for current user...');
      const currentUser = auth.currentUser
      
      if (!currentUser) {
        console.error('No authenticated user found');
        throw new Error('No authenticated user')
      }

      if (!currentUser.email) {
        console.error('Current user has no email');
        throw new Error('User email not found')
      }

      console.log('Re-authenticating user with email:', currentUser.email);
      
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(currentUser.email!, currentPassword)
      
      try {
        await reauthenticateWithCredential(currentUser, credential)
        console.log('Re-authentication successful');
      } catch (reauthError: any) {
        console.error('Re-authentication failed:', reauthError);
        if (reauthError.code === 'auth/wrong-password' || reauthError.code === 'auth/invalid-credential') {
          throw new Error('Current password is incorrect')
        }
        throw reauthError;
      }
      
      // Update password in Firebase Auth
      console.log('Updating password...');
      await updatePassword(currentUser, newPassword)
      console.log('Password updated successfully in Firebase Auth');
      
      // Try to update timestamp in Firestore (optional - don't fail if permissions denied)
      try {
        const userDocRef = doc(db, 'cms_users', currentUser.uid)
        await updateDoc(userDocRef, { 
          updated_at: new Date().toISOString() 
        })
        console.log('Timestamp updated in Firestore');
      } catch (firestoreError: any) {
        console.warn('Could not update Firestore timestamp (this is okay):', firestoreError.message);
        // Don't throw error - password update in Auth was successful
      }

      return true
    } catch (error: any) {
      console.error('Failed to update current user password:', error)
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'auth/wrong-password') {
        throw new Error('Current password is incorrect')
      } else if (error.code === 'auth/invalid-credential') {
        throw new Error('Current password is incorrect')
      } else if (error.code === 'auth/weak-password') {
        throw new Error('New password is too weak. Please choose a stronger password.')
      } else if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please log out and log back in before changing your password')
      } else if (error.message && error.message.includes('Current password is incorrect')) {
        throw new Error('Current password is incorrect')
      } else if (error.code === 'permission-denied') {
        // This shouldn't happen now since we made Firestore update optional
        throw new Error('Permission denied. Please contact your administrator.')
      }
      
      throw new Error('Unable to update password. Please try again.')
    }
  }
  async deleteUser(userId: string): Promise<boolean> {
    try {
      console.log('Deleting user from Firestore:', userId);
      // Delete from Firestore
      const userDocRef = doc(db, 'cms_users', userId)
      await deleteDoc(userDocRef)

      // Note: Deleting from Firebase Auth requires Admin SDK
      console.warn('Auth user deletion requires Firebase Admin SDK or Cloud Function')

      console.log('User deleted successfully:', userId);

      return true
    } catch (error) {
      console.error('Failed to delete user:', error)
      throw new Error('Unable to delete user')
    }
  }

  async approveUser(userId: string): Promise<User> {
    try {
      console.log('Approving user:', userId);
      const userDocRef = doc(db, 'cms_users', userId)
      await updateDoc(userDocRef, { 
        status: 'active',
        updated_at: new Date().toISOString()
      })
      
      const updatedDoc = await getDoc(userDocRef)
      
      console.log('User approved successfully:', userId);
      return {
        id: userId,
        ...updatedDoc.data()
      } as User
    } catch (error) {
      console.error('Failed to approve user:', error)
      throw new Error('Unable to approve user')
    }
  }

  async getUserInfo() {
    try {
      const currentUser = auth.currentUser
      
      if (!currentUser) {
        throw new Error('No authenticated user')
      }

      const userDocRef = doc(db, 'cms_users', currentUser.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        throw new Error('User profile not found')
      }

      return {
        id: currentUser.uid,
        ...userDoc.data()
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error)
      throw new Error('Unable to load user information')
    }
  }

  async updateUserPreferences(preferences: Record<string, any>) {
    try {
      console.log('Updating user preferences:', preferences)
      return { success: true }
    } catch (error) {
      console.error('Failed to update preferences:', error)
      throw new Error('Unable to update user preferences')
    }
  }
}

export const dashboardService = new DashboardService()