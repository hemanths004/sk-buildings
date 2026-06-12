import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building, 
  Home, 
  Users, 
  FileBarChart, 
  Settings,
  LogOut,
  Calculator
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: Building },
    { name: 'Properties', path: '/admin/properties', icon: Home },
    { name: 'Pricing Rules', path: '/admin/pricing-rules', icon: Calculator },
    { name: 'About', path: '/admin/about', icon: Users },
    { name: 'Reports', path: '/admin/reports', icon: FileBarChart },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-dark-light border-r border-primary/20 flex flex-col h-screen sticky top-0">
      {/* Logo Area */}
      <div className="py-8 flex items-center justify-center border-b border-primary/20">
        <img src="/logo.png" alt="logo" className="w-48 h-auto object-contain drop-shadow-lg" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-dark font-semibold'
                      : 'text-grey-light hover:text-white hover:bg-dark-lighter'
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-primary/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-grey-light hover:text-red-500 hover:bg-red-500/10 w-full transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
