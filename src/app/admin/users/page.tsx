'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { 
  MagnifyingGlassIcon, 
  UserCircleIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  avatar: string | null;
  createdAt: string;
  stats?: {
    totalBookings?: number;
    completedBookings?: number;
    totalEarnings?: number;
    totalSpent?: number;
    rating?: number;
  };
}

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('role') || 'ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (user && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    
    if (user) {
      fetchUsers();
    }
  }, [user, authLoading, filter, statusFilter, search]);

  const fetchUsers = async () => {
    try {
      let url = `/admin/users?role=${filter}&limit=100`;
      if (search) url += `&search=${search}`;
      
      const response = await api.get(url);
      let filteredUsers = response.data.data.users;
      
      if (statusFilter === 'active') {
        filteredUsers = filteredUsers.filter((u: User) => u.isActive === true);
      } else if (statusFilter === 'banned') {
        filteredUsers = filteredUsers.filter((u: User) => u.isActive === false);
      }
      
      setUsers(filteredUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean, reason?: string) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { 
        isActive: !currentStatus,
        reason: reason || `User ${!currentStatus ? 'activated' : 'banned'} by admin`
      });
      toast.success(`User ${!currentStatus ? 'activated' : 'banned'} successfully`);
      fetchUsers();
      setShowModal(false);
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'ADMIN': 
        return { color: 'bg-purple-100 text-purple-800', icon: ShieldCheckIcon, label: 'Administrator' };
      case 'TUTOR': 
        return { color: 'bg-green-100 text-green-800', icon: AcademicCapIcon, label: 'Tutor' };
      case 'STUDENT': 
        return { color: 'bg-blue-100 text-blue-800', icon: UserGroupIcon, label: 'Student' };
      default: 
        return { color: 'bg-gray-100 text-gray-800', icon: UserCircleIcon, label: 'User' };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    banned: users.filter(u => !u.isActive).length,
    tutors: users.filter(u => u.role === 'TUTOR').length,
    students: users.filter(u => u.role === 'STUDENT').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage all users on the platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Users</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-green-600">Active</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.banned}</p>
          <p className="text-sm text-red-600">Banned</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
          <p className="text-sm text-purple-600">Admins</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.tutors}</p>
          <p className="text-sm text-blue-600">Tutors</p>
        </div>
        <div className="bg-indigo-50 rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">{stats.students}</p>
          <p className="text-sm text-indigo-600">Students</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="TUTOR">Tutors</option>
            <option value="ADMIN">Admins</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="active">Active Only</option>
            <option value="banned">Banned Only</option>
          </select>
          
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <button
            onClick={fetchUsers}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const roleBadge = getRoleBadge(user.role);
                const RoleIcon = roleBadge.icon;
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => {
                    setSelectedUser(user);
                    setShowModal(true);
                  }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                          ) : (
                            <span className="text-indigo-600 font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${roleBadge.color}`}>
                        <RoleIcon className="h-3 w-3" />
                        {roleBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? (
                          <CheckCircleIcon className="h-3 w-3" />
                        ) : (
                          <XCircleIcon className="h-3 w-3" />
                        )}
                        {user.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.role === 'TUTOR' ? (
                        <div>${user.stats?.totalEarnings || 0} earned</div>
                      ) : user.role === 'STUDENT' ? (
                        <div>{user.stats?.totalBookings || 0} sessions</div>
                      ) : (
                        <div>-</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleUserStatus(user.id, user.isActive);
                        }}
                        className={`text-sm font-medium ${
                          user.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {user.isActive ? 'Ban User' : 'Activate User'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-12">
            <UserCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-3xl text-indigo-600 font-bold">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.isActive ? 'Active' : 'Banned'}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-semibold">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-semibold">{selectedUser.role}</p>
                </div>
              </div>

              {/* Role-specific stats */}
              {selectedUser.role === 'TUTOR' && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Tutor Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                      <p className="text-xl font-bold text-green-600">${selectedUser.stats?.totalEarnings || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Sessions</p>
                      <p className="text-xl font-bold text-blue-600">{selectedUser.stats?.totalBookings || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completed Sessions</p>
                      <p className="text-xl font-bold text-green-600">{selectedUser.stats?.completedBookings || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="text-xl font-bold text-yellow-600">{selectedUser.stats?.rating?.toFixed(1) || 0} ⭐</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedUser.role === 'STUDENT' && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Student Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-xl font-bold text-green-600">${selectedUser.stats?.totalSpent || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Sessions</p>
                      <p className="text-xl font-bold text-blue-600">{selectedUser.stats?.totalBookings || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completed Sessions</p>
                      <p className="text-xl font-bold text-green-600">{selectedUser.stats?.completedBookings || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  onClick={() => toggleUserStatus(selectedUser.id, selectedUser.isActive)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    selectedUser.isActive 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedUser.isActive ? 'Ban User' : 'Activate User'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}