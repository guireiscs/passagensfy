import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  User, Crown, Bell, Shield, LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AccountLayout: React.FC = () => {
  const { user, profile, signOut, isPremium } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-8">Minha Conta</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="bg-gradient-to-r from-brand-dark to-brand-purple p-6 text-white">
                <div className="mb-4 flex items-center justify-center">
                  <div className="bg-white text-brand-purple rounded-full p-4">
                    <User size={32} />
                  </div>
                </div>
                <h2 className="text-center text-xl font-semibold mb-1">{profile?.name}</h2>
                <p className="text-center text-white opacity-80">{profile?.email}</p>
                
                {isPremium && (
                  <div className="flex justify-center mt-3">
                    <div className="bg-yellow-400 text-yellow-900 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                      <Crown size={14} className="mr-1" />
                      Premium
                    </div>
                  </div>
                )}
              </div>
              
              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <NavLink
                      to="/account/profile"
                      className={({ isActive }) => `w-full flex items-center p-3 rounded-lg transition ${
                        isActive ? 'bg-purple-50 text-brand-purple' : 'hover:bg-gray-50'
                      }`}
                    >
                      <User size={18} className="mr-3" />
                      <span>Perfil</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/account/subscription"
                      className={({ isActive }) => `w-full flex items-center p-3 rounded-lg transition ${
                        isActive ? 'bg-purple-50 text-brand-purple' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Crown size={18} className="mr-3" />
                      <span>Assinatura</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/account/notifications"
                      className={({ isActive }) => `w-full flex items-center p-3 rounded-lg transition ${
                        isActive ? 'bg-purple-50 text-brand-purple' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Bell size={18} className="mr-3" />
                      <span>Notificações</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/account/security"
                      className={({ isActive }) => `w-full flex items-center p-3 rounded-lg transition ${
                        isActive ? 'bg-purple-50 text-brand-purple' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Shield size={18} className="mr-3" />
                      <span>Segurança</span>
                    </NavLink>
                  </li>
                  <li className="pt-4 mt-4 border-t border-gray-200">
                    <NavLink
                      to="/help"
                      className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Central de Ajuda</span>
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut size={18} className="mr-3" />
                      <span>Sair</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;