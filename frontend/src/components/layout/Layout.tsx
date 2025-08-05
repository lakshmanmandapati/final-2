import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Clock, 
  Mic, 
  BarChart3, 
  LogOut,
  User,
  Crown,
  ChevronDown,
  GraduationCap
} from 'lucide-react';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Subjects', href: '/subjects', icon: BookOpen },
    { name: 'Sessions', href: '/sessions', icon: Clock },
    { name: 'Audio Notes', href: '/audio', icon: Mic },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ...(user?.role === 'admin' ? [{ name: 'Admin', href: '/admin', icon: Crown }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/50 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">StudySphere</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive(item.href) 
                    ? 'text-blue-600 bg-blue-50 font-semibold shadow-sm' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200/50 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || 'student'}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:pl-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span>Welcome back,</span>
                <span className="font-medium text-gray-900">
                  {user?.email?.split('@')[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
