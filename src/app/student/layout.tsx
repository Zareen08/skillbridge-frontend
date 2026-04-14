'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  BookOpenIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function StudentLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user && user.role !== 'STUDENT') {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const links = [
    { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon },
    { name: 'My Profile', href: '/student/profile', icon: UserIcon },
    { name: 'My Bookings', href: '/student/bookings', icon: CalendarIcon },
    { name: 'Find Tutors', href: '/tutors', icon: BookOpenIcon },
    { name: 'My Reviews', href: '/student/reviews', icon: StarIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-indigo-600">Student Panel</h2>
          <p className="text-sm text-gray-500 mt-1">{user?.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{link.name}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-6 bg-indigo-600 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            <p>Student Account</p>
            <p className="mt-1">Need help? Contact support</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}