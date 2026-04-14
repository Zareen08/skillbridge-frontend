'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Protect Admin Routes
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (user && user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarIcon },
    { name: 'Categories', href: '/admin/categories', icon: TagIcon },
    { name: 'Analytics', href: '/admin/analytics/platform', icon: ChartBarIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-indigo-600">SkillBridge Admin</h2>
        </div>

        <nav className="p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

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
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="bg-white shadow px-6 py-5.5 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">
            Admin Panel
          </h1>

          <div className="flex items-center gap-3">
            <img
              src={user.avatar || 'https://i.pravatar.cc/40'}
              alt="avatar"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}