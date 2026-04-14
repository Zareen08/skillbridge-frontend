'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../lib/axios';
import toast from 'react-hot-toast';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

export default function StudentReviewPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (user && user.role !== 'STUDENT') {
      router.push('/');
      return;
    }
    
    if (bookingId && user) {
      fetchBooking();
    }
  }, [user, authLoading, bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      setBooking(response.data.data);
    } catch (error: any) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking');
      router.push('/student/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // FIX: Use booking.tutor.id which is the USER ID (not profile ID)
      // The backend expects tutorId to be the user ID
      await api.post('/reviews', {
        bookingId,
        rating,
        comment,
        tutorId: booking.tutor.id  // This is the correct user ID
      });
      toast.success('Review submitted successfully!');
      router.push('/student/bookings');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Review Your Session</h1>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-lg">
                {booking?.tutor?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{booking?.tutor?.name}</p>
              <p className="text-sm text-gray-600">{booking?.tutor?.tutorProfile?.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(booking?.date).toLocaleDateString()} at {new Date(booking?.date).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating *
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  {star <= (hoverRating || rating) ? (
                    <StarIcon className="h-8 w-8 text-yellow-400" />
                  ) : (
                    <StarOutlineIcon className="h-8 w-8 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {rating === 5 && "Excellent! ⭐⭐⭐⭐⭐"}
              {rating === 4 && "Very Good! ⭐⭐⭐⭐"}
              {rating === 3 && "Good! ⭐⭐⭐"}
              {rating === 2 && "Fair! ⭐⭐"}
              {rating === 1 && "Poor! ⭐"}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              required
              rows={6}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Share your experience with this tutor... What did you like? What could be improved?"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}