import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import {
  LayoutDashboard, 
  Users, 
  PlaneTakeoff, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Bell,
  Search,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and has admin access
    if (!user) {
      navigate('/login');
      return;
    }
    
    // If not admin, redirect to home
    if (!isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-gray-900/70"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 lg:static lg:w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <div className="flex items-center space-x-1 cursor-pointer text-brand-purple">
              <span className="text-xl font-medium tracking-tight">passagensfy</span>
              <div className="w-5 h-5">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                </svg>
              </div>
              <span className="text-xl font-medium">Admin</span>
            </div>
            
            <button 
              className="ml-auto lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <nav className="space-y-1">
              <NavLink 
                to="/admin"
                end
                className={({ isActive }) => `flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive ? 'bg-brand-purple text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard size={18} className="mr-3" />
                <span>Dashboard</span>
              </NavLink>
              
              <NavLink 
                to="/admin/promotions"
                className={({ isActive }) => `flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive ? 'bg-brand-purple text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <PlaneTakeoff size={18} className="mr-3" />
                <span>Gerenciar Promoções</span>
              </NavLink>
              
              <NavLink 
                to="/admin/users"
                className={({ isActive }) => `flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive ? 'bg-brand-purple text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users size={18} className="mr-3" />
                <span>Gerenciar Usuários</span>
              </NavLink>
              
              <NavLink 
                to="/admin/orders"
                className={({ isActive }) => `flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive ? 'bg-brand-purple text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ShoppingCart size={18} className="mr-3" />
                <span>Pedidos</span>
              </NavLink>
              
              <NavLink 
                to="/admin/settings"
                className={({ isActive }) => `flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive ? 'bg-brand-purple text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings size={18} className="mr-3" />
                <span>Configurações</span>
              </NavLink>
            </nav>
          </div>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-10">
          <button 
            className="lg:hidden mr-4"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
          
          <div className="flex-1">
            <div className="relative max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center ml-4 space-x-4">
            <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative ml-3">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-brand-purple text-white flex items-center justify-center overflow-hidden">
                  <User size={18} />
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-medium text-sm text-gray-900">{profile?.name || 'Admin'}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <ChevronDown size={16} />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <NavLink 
                    to="/admin/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Configurações
                  </NavLink>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4 text-center text-xs text-gray-500">
          <p>© 2025 passagensfy Admin Panel. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;