import React, { useState } from 'react';
import { useEffect } from 'react';
import { Save, User, Globe, Plus, Edit, Trash2, Check, X, Shield, Mail, Calendar } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import type { User as UserType } from '../types';
import { useAuth } from '../../../hooks/useAuth';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending';
  lastLogin: string;
  createdAt: string;
}

export const SettingsView: React.FC = () => {
  const { canManageUsers, user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    totalRoles: 3
  });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'editor',
    password: '',
    confirmPassword: ''
  });

  const [users, setUsers] = useState<UserType[]>([]);
  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    role: '',
    newPassword: '',
    confirmPassword: ''
  });

  // State for non-admin password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    // Only load user management data if user is an administrator
    if (canManageUsers()) {
      console.log('Admin user detected in SettingsView, loading data...');
      loadAdminData();
    } else {
      console.log('Non-admin user, skipping data load');
    }
  }, [canManageUsers]);

  const loadAdminData = async () => {
    // Only administrators should load users
    if (!canManageUsers()) {
      console.log('🚫 User is not admin, skipping user load');
      return;
    }
    
    try {
      console.log('👑 Loading admin data...');
      
      setError(null);
      
      // Load both users and stats in parallel
      const [userData, stats] = await Promise.all([
        dashboardService.getUsers(),
        dashboardService.getDashboardStats()
      ]);
      
      setUsers(userData);
      setDashboardStats(stats);
      console.log('✅ Admin data loaded successfully');
    } catch (err) {
      console.error('❌ Error loading users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
      
      // Check if it's a permission error and provide specific guidance
      if (errorMessage.includes('Permission denied') || errorMessage.includes('permission-denied')) {
        setError(`${errorMessage}\n\nTo fix this issue:\n1. Go to Firebase Console → Firestore Database\n2. Navigate to cms_users collection\n3. Ensure your user document ID matches your Firebase Auth UID\n4. Verify your user has role: "administrator" and status: "active"`);
      } else {
        setError(errorMessage);
      }
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    // Only show User Management tab for administrators
    ...(canManageUsers() ? [{ id: 'users', label: 'User Management', icon: User }] : [])
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'bg-purple-100 text-purple-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'author':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddUser = async () => {
    // Validate required fields
    if (!newUser.name.trim()) {
      setError('Full name is required');
      return;
    }
    
    if (!newUser.email.trim()) {
      setError('Email address is required');
      return;
    }
    
    if (!newUser.password) {
      setError('Password is required');
      return;
    }
    
    if (newUser.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newUser.name && newUser.email && newUser.password === newUser.confirmPassword) {
      try {
        setError(null);
        await dashboardService.createUser({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          password: newUser.password
        });
        
        // Show success message
        alert(`User created successfully! The user account is pending approval and will need to be activated before they can log in.`);
        
        await loadAdminData();
        setShowAddUserModal(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create user');
      }
      setNewUser({ name: '', email: '', role: 'editor', password: '', confirmPassword: '' });
    } else {
      setError('Please fill in all required fields correctly');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        setError(null);
        await dashboardService.deleteUser(userId);
        await loadAdminData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete user');
      }
    }
  };

  const handleApproveUser = async (userId: string) => {
    console.log('Approving user:', userId);
    try {
      setError(null);
      await dashboardService.approveUser(userId);
      await loadAdminData();
      alert(`User approved successfully!`);
    } catch (err) {
      console.error('Error approving user:', err);
      setError(err instanceof Error ? err.message : 'Failed to approve user');
    }
  };

  const handleResetPassword = async (userId: string) => {
    console.log('Resetting password for user:', userId);
    // In a real app, this would trigger a password reset email
    const newPassword = prompt('Enter new password for user:');
    if (newPassword) {
      try {
        setError(null);
        await dashboardService.updateUserPassword(userId, newPassword);
        alert('Password updated successfully');
      } catch (err) {
        console.error('Error resetting password:', err);
        setError(err instanceof Error ? err.message : 'Failed to update password');
      }
    }
  };

  const handleEditUser = (user: UserType) => {
    console.log('Editing user:', user);
    setEditingUser(user);
    setEditUserData({
      name: user.name,
      email: user.email,
      role: user.role,
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleSaveEditUser = async () => {
    console.log('Deleting user:', userId);
    if (!editingUser) return;

    try {
      setError(null);

      // Update user basic info
      await dashboardService.updateUser(editingUser.id, {
        name: editUserData.name,
        email: editUserData.email,
        role: editUserData.role
      });

        console.error('Error deleting user:', err);
      // Update password if provided
      if (editUserData.newPassword && editUserData.newPassword === editUserData.confirmPassword) {
        await dashboardService.updateUserPassword(editingUser.id, editUserData.newPassword);
      }

      await loadAdminData();
      setEditingUser(null);
      setEditUserData({ name: '', email: '', role: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handlePasswordUpdate = async () => {
    if (!user) return;

    console.log('Password update initiated by user:', user.email);

    // Validation
    if (!passwordData.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError('New password is required');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    console.log('Validation passed, calling dashboardService...');

    try {
      setPasswordError(null);
      setPasswordSuccess(false);

      // Use Firebase's updatePassword method
      await dashboardService.updateCurrentUserPassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      console.log('Password update successful');
      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Show success message
      setTimeout(() => setPasswordSuccess(false), 5000);
    } catch (err) {
      console.error('Password update failed in component:', err);
      setPasswordError(err instanceof Error ? err.message : 'Failed to update password');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return canManageUsers() ? renderAdminGeneralSettings() : renderUserProfileSettings();

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">Manage user accounts, roles, and permissions</p>
              </div>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Users</p>
                    <p className="text-2xl font-semibold text-blue-900">{dashboardStats.totalUsers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Check className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Active</p>
                    <p className="text-2xl font-semibold text-green-900">
                      {dashboardStats.activeUsers}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-600">Pending</p>
                    <p className="text-2xl font-semibold text-yellow-900">
                      {dashboardStats.pendingUsers}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Roles</p>
                    <p className="text-2xl font-semibold text-blue-900">{dashboardStats.totalRoles}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            {user.status === 'pending' && (
                              <button
                                onClick={() => handleApproveUser(user.id)}
                                className="text-green-600 hover:text-green-900 px-2 py-1 text-xs bg-green-50 rounded hover:bg-green-100"
                                title="Approve User"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => handleResetPassword(user.id)}
                              className="text-blue-600 hover:text-blue-900 px-2 py-1 text-xs bg-blue-50 rounded hover:bg-blue-100"
                              title="Reset Password"
                            >
                              Reset
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900 px-2 py-1 text-xs bg-blue-50 rounded hover:bg-blue-100"
                              title="Edit User"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 px-2 py-1 text-xs bg-red-50 rounded hover:bg-red-100"
                              title="Delete User"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderAdminGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Site Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              defaultValue="My CMS Website"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Description
            </label>
            <input
              type="text"
              defaultValue="A powerful content management system"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Language
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>UTC-8 (Pacific Time)</option>
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC+0 (GMT)</option>
              <option>UTC+1 (Central European Time)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Settings</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <User className="h-5 w-5 text-blue-600 mr-2" />
            <p className="text-sm text-blue-800">
              Update your personal information and account preferences
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={user?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue={user?.email || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <input
              type="text"
              value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Role cannot be changed by users</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Status
            </label>
            <div className="flex items-center">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user?.status || 'pending')}`}>
                {user?.status?.charAt(0).toUpperCase() + user?.status?.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Change Password</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => {
                setPasswordData({ ...passwordData, currentPassword: e.target.value });
                if (passwordError) setPasswordError(null);
              }}
              placeholder="Enter your current password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => {
                setPasswordData({ ...passwordData, newPassword: e.target.value });
                if (passwordError) setPasswordError(null);
              }}
              placeholder="Enter new password (min 6 characters)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => {
                setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                if (passwordError) setPasswordError(null);
              }}
              placeholder="Confirm your new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
            )}
          </div>
        </div>
        
        {passwordError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {passwordError}
          </div>
        )}
        
        {passwordSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
            Password updated successfully!
          </div>
        )}
        
        <div className="mt-4">
          <button 
            onClick={handlePasswordUpdate}
            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Password
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Account Information</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Member Since:</span>
              <span className="ml-2 text-gray-600">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Last Login:</span>
              <span className="ml-2 text-gray-600">
                {user?.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage your CMS configuration and user accounts</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    error && error.includes('Password') ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter password (min 6 characters)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    error && error.includes('match') ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {newUser.password && newUser.confirmPassword && newUser.password !== newUser.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddUser}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add User
              </button>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editUserData.name}
                  onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={editUserData.role}
                  onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  value={editUserData.newPassword}
                  onChange={(e) => setEditUserData({ ...editUserData, newPassword: e.target.value })}
                  placeholder="Leave blank to keep current password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={editUserData.confirmPassword}
                  onChange={(e) => setEditUserData({ ...editUserData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSaveEditUser}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};