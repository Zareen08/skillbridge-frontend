'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function TutorLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user && user.role !== 'TUTOR') router.push('/');
  }, [user, loading]);

  if (loading || !user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const links = [
    { name: 'Dashboard', href: '/tutor/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/tutor/profile', icon: UserIcon },
    { name: 'Availability', href: '/tutor/availability', icon: ClockIcon },
    { name: 'Bookings', href: '/tutor/bookings', icon: CalendarIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow">
        <div className="p-6 font-bold text-indigo-600">Tutor Panel</div>

        <nav className="p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                  active ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}