"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminLinks = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Menu', href: '/admin/menu' },
  { name: 'Tables', href: '/admin/tables' },
  // --- THIS IS THE FIX ---
  { name: 'Bookings', href: '/admin/bookings' }, 
  // --- END OF FIX ---
  { name: 'Analytics', href: '/admin/analytics' },
  { name: 'Settings', href: '/admin/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col fixed">
      <div className="p-5 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {adminLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link key={link.name} href={link.href}>
              <span
                className={`block w-full px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button className="w-full text-left px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700">
          Logout (placeholder)
        </button>
      </div>
    </div>
  );
}
