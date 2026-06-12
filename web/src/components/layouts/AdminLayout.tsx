import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-dark">
        <main>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
};
