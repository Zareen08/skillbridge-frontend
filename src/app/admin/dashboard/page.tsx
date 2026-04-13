'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import { UsersIcon, BookOpenIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface DashboardStats {
  users: {
    total: number;
    tutors: number;
    students: number;
    active: number;
    banned: number;
  };
  bookings: {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
    completionRate: string;
  };
  revenue: {
    total: number;
  };
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

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
      fetchDashboardStats();
    }
  }, [user, authLoading]);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data.data);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Users', value: stats?.users?.total || 0, icon: UsersIcon, color: 'bg-blue-500', link: '/admin/users' },
    { name: 'Total Tutors', value: stats?.users?.tutors || 0, icon: UsersIcon, color: 'bg-green-500', link: '/admin/users?role=TUTOR' },
    { name: 'Total Students', value: stats?.users?.students || 0, icon: UsersIcon, color: 'bg-purple-500', link: '/admin/users?role=STUDENT' },
    { name: 'Total Bookings', value: stats?.bookings?.total || 0, icon: BookOpenIcon, color: 'bg-yellow-500', link: '/admin/bookings' },
    { name: 'Completed Sessions', value: stats?.bookings?.completed || 0, icon: BookOpenIcon, color: 'bg-indigo-500', link: '/admin/bookings?status=COMPLETED' },
    { name: 'Total Revenue', value: `$${stats?.revenue?.total?.toFixed(2) || 0}`, icon: CurrencyDollarIcon, color: 'bg-red-500', link: '/admin/analytics' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.link}>
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-full p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Booking Stats */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Booking Statistics</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Bookings</span>
                <span className="font-semibold">{stats?.bookings?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">{stats?.bookings?.completed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cancelled</span>
                <span className="font-semibold text-red-600">{stats?.bookings?.cancelled || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">{stats?.bookings?.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold">{stats?.bookings?.completionRate || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">User Statistics</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Users</span>
                <span className="font-semibold text-green-600">{stats?.users?.active || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Banned Users</span>
                <span className="font-semibold text-red-600">{stats?.users?.banned || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tutors</span>
                <span className="font-semibold">{stats?.users?.tutors || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Students</span>
                <span className="font-semibold">{stats?.users?.students || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}