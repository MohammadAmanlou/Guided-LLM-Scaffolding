import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function Layout() {
  const { pathname } = useLocation();
  const hideNavbar = pathname === '/login' || pathname === '/signup';

  return (
    <div className="min-h-screen font-[var(--chat-font)]">
      {!hideNavbar && <Navbar />}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
