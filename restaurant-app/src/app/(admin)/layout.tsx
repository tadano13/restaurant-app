import React from 'react';
import Sidebar from 'I:/restaurant-app/src/components/customer/admin/Sidebar';

// This layout will wrap all admin-facing pages
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      {/* Main content area, offset for the sidebar */}
      <div className="flex-grow ml-64">
        <main className="p-8">
          {/* Admin-specific header could go here */}
          {children}
        </main>
      </div>
    </div>
  );
}