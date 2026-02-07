import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Package, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from './AuthContext';

export const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-dark-700">
        <h1 className="font-serif text-xl font-bold text-gold-500">MARZETTI</h1>
        <span className="text-xs text-neutral-400 uppercase tracking-widest">Admin</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <NavLink
          to="/admin/productos"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-gold-500 text-dark-900 font-semibold'
                : 'text-neutral-300 hover:bg-dark-700 hover:text-white'
            }`
          }
        >
          <Package size={20} />
          Productos
        </NavLink>
      </nav>

      <div className="p-4 border-t border-dark-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-dark-700 hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={20} />
          Salir
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-dark-900 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-dark-900 z-50 flex flex-col transform transition-transform duration-200 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white"
        >
          <X size={24} />
        </button>
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-neutral-200 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-dark-900 hover:bg-neutral-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <span className="font-serif font-bold text-dark-900">MARZETTI <span className="text-xs text-neutral-400 uppercase">Admin</span></span>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
