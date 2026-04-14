'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

interface Booking {
  id: string;
  bookingNumber?: string;
  date: string;
  duration: number;
  totalAmount: number;
  status: string;
  notes?: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  tutor: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    tutorProfile?: {
      title: string;
    };
  };
  review?: {
    id: string;
    rating: number;
    comment: string;
  };
}

export default function AdminBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

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
      fetchBookings();
    }
  }, [user, authLoading, statusFilter, search]);

  const fetchBookings = async () => {
    try {
      let url = `/admin/bookings?limit=100`;
      if (statusFilter !== 'ALL') url += `&status=${statusFilter}`;
      if (search) url += `&search=${search}`;
      
      const response = await api.get(url);
      setBookings(response.data.data.bookings || []);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }
    
    try {
      await api.post(`/admin/bookings/${bookingId}/cancel`, { reason: cancelReason });
      toast.success('Booking cancelled successfully');
      fetchBookings();
      setShowModal(false);
      setCancelReason('');
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'CONFIRMED':
        return { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, label: 'Confirmed' };
      case 'COMPLETED':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, label: 'Completed' };
      case 'CANCELLED':
        return { color: 'bg-red-100 text-red-800', icon: XCircleIcon, label: 'Cancelled' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: ClockIcon, label: status };
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
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalAmount, 0),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-600 mt-2">View and manage all platform bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Bookings</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.confirmed}</p>
          <p className="text-sm text-yellow-600">Confirmed</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-sm text-green-600">Completed</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          <p className="text-sm text-red-600">Cancelled</p>
        </div>
        <div className="bg-indigo-50 rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">${stats.totalRevenue}</p>
          <p className="text-sm text-indigo-600">Total Revenue</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          
          <input
            type="text"
            placeholder="Search by student or tutor name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          <button
            onClick={fetchBookings}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => {
                const statusBadge = getStatusBadge(booking.status);
                const StatusIcon = statusBadge.icon;
                
                return (
                  <tr key={booking.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => {
                    setSelectedBooking(booking);
                    setShowModal(true);
                  }}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.duration} minutes
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{booking.student.name}</div>
                        <div className="text-sm text-gray-500">{booking.student.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{booking.tutor.name}</div>
                        <div className="text-sm text-gray-500">{booking.tutor.tutorProfile?.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-600">${booking.totalAmount}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
                            setShowModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {bookings.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No bookings found</p>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setCancelReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-semibold">{new Date(selectedBooking.date).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{selectedBooking.duration} minutes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold text-green-600">${selectedBooking.totalAmount}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold">{selectedBooking.status}</p>
                </div>
              </div>

              {/* Student & Tutor Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Student Information</h4>
                  <p className="font-medium">{selectedBooking.student.name}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.student.email}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Tutor Information</h4>
                  <p className="font-medium">{selectedBooking.tutor.name}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.tutor.email}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.tutor.tutorProfile?.title}</p>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Booking Notes</h4>
                  <p className="text-sm">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Review */}
              {selectedBooking.review && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Student Review</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold">{selectedBooking.review.rating}/5</span>
                  </div>
                  <p className="text-sm">{selectedBooking.review.comment}</p>
                </div>
              )}

              {/* Cancel Form */}
              {selectedBooking.status === 'CONFIRMED' && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Cancel Booking</h4>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Reason for cancellation..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                    rows={3}
                  />
                  <button
                    onClick={() => cancelBooking(selectedBooking.id)}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setShowModal(false);
                  setCancelReason('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}