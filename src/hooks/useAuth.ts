import { useState, useEffect } from 'react'
import { auth, db } from '../lib/firebase'
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'administrator' | 'editor' | 'author'
  status: 'active' | 'pending'
  last_login?: string | null
  created_at: string
  updated_at: string
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      setError(null)
      
      const userDocRef = doc(db, 'cms_users', firebaseUser.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        console.error('User profile not found in Firestore')
        setError('User profile not found. Please contact administrator.')
        await signOut(auth)
        return
      }

      const userData = userDoc.data()

      if (userData.status !== 'active') {
        setError('Your account is not active. Please contact administrator.')
        await signOut(auth)
        return
      }

      setUser({
        id: firebaseUser.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status,
        last_login: userData.last_login,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      })
    } catch (error) {
      console.error('Auth error:', error)
      setError('Authentication error occurred')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setError(null)
    } catch (error) {
      console.error('Logout error:', error)
      setError('Failed to logout')
    }
  }

  const isAdmin = () => {
    return user?.role === 'administrator'
  }

  const canManageUsers = () => {
    return user?.role === 'administrator'
  }

  return {
    user,
    loading,
    error,
    logout,
    isAdmin,
    canManageUsers
  }
}