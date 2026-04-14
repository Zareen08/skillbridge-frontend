'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CalendarIcon, ClockIcon, CheckCircleIcon, XCircleIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Booking {
  id: string;
  date: string;
  duration: number;
  totalAmount: number;
  status: string;
  isReviewed?: boolean;
  review?: {
    id: string;
    rating: number;
    comment: string;
  } | null;
  tutor: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    tutorProfile: {
      title: string;
    };
  };
}

export default function StudentBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (user && user.role !== 'STUDENT') {
      router.push('/');
      return;
    }
    
    if (user) {
      fetchBookings();
    }
  }, [user, authLoading]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: 'CANCELLED' });
      toast.success('Booking cancelled successfully');
      fetchBookings();
      setShowModal(false);
      setSelectedBooking(null);
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getFilteredBookings = () => {
    if (filter === 'ALL') return bookings;
    return bookings.filter(b => b.status === filter);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'CONFIRMED':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">View and manage all your tutoring sessions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
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
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  filter === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No bookings found</p>
            <Link href="/tutors" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
              Find a tutor →
            </Link>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold">
                        {booking.tutor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{booking.tutor.name}</p>
                      <p className="text-sm text-gray-500">{booking.tutor.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium">
                        {new Date(booking.date).toLocaleDateString()} at {new Date(booking.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{booking.duration} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium text-green-600">${booking.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  {booking.status === 'CONFIRMED' && new Date(booking.date) > new Date() && (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowModal(true);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  )}
                  {booking.status === 'COMPLETED' && !booking.isReviewed && !booking.review && (
                    <Link
                      href={`/student/review/${booking.id}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 text-center"
                    >
                      Leave Review
                    </Link>
                  )}
                  {booking.status === 'COMPLETED' && booking.review && (
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium">{booking.review.rating}/5</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">You reviewed this session</p>
                    </div>
                  )}
                  <Link
                    href={`/student/booking/${booking.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cancel Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Cancel Booking</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel the session with <strong>{selectedBooking.tutor.name}</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Date: {new Date(selectedBooking.date).toLocaleString()}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedBooking(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  No, Keep
                </button>
                <button
                  onClick={() => cancelBooking(selectedBooking.id)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}