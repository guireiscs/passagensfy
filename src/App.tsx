import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import AccountLayout from './layouts/AccountLayout';
import AdminLayout from './layouts/AdminLayout';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManagePromotions from './pages/admin/ManagePromotions';
import ManageUsers from './pages/admin/ManageUsers';
import ManageOrders from './pages/admin/ManageOrders';
import Settings from './pages/admin/Settings';

// User Pages
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import PromotionsList from './components/PromotionsList';
import PromotionDetails from './pages/PromotionDetails';
import Search from './pages/Search';
import ContactUs from './pages/ContactUs';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import CancellationPolicy from './pages/CancellationPolicy';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import SubscriptionCancel from './pages/SubscriptionCancel';
import AdminAccess from './pages/AdminAccess';

// Account Pages
import AccountManagement from './pages/AccountManagement';
import ProfilePage from './pages/account/ProfilePage';
import SubscriptionPage from './pages/account/SubscriptionPage';
import NotificationsPage from './pages/account/NotificationsPage';
import SecurityPage from './pages/account/SecurityPage';

interface AuthRouteProps {
  children: React.ReactNode;
}

function App() {
  const { isAuthenticated, user, profile, isLoading, isPremium, isAdmin, signOut } = useAuth();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Armazenar o estado de autenticação no localStorage para evitar tela de loading
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
    } else if (!isLoading && !isAuthenticated) {
      localStorage.removeItem('isAuthenticated');
    }
  }, [isLoading, isAuthenticated]);

  // Verificar se o usuário já estava autenticado anteriormente
  const wasAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // Mostrar loading apenas se não houver informação prévia de autenticação
  if (isLoading && !wasAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  // Protected route component
  const AuthRoute = ({ children }: AuthRouteProps) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
  };

  // Admin route component that checks for admin access
  const AdminRoute = ({ children }: AuthRouteProps) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    // Check if user has admin access
    if (!isAdmin) {
      return <Navigate to="/admin-access" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="promotions" element={<ManagePromotions />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Account Routes - Movidas para o layout principal */}

          {/* Public Routes with Header */}
          <Route
            path="/*"
            element={
              <>
                <Header
                  isLoggedIn={isAuthenticated}
                  user={profile}
                  isPremium={isPremium}
                  isAdmin={isAdmin}
                  handleLogout={signOut}
                  setShowSubscriptionModal={setShowSubscriptionModal}
                />
                <div className="min-h-screen pt-16"> {/* Add padding-top to account for fixed header */}
                  <Routes>
                    <Route path="/" element={<AuthRoute><Navigate to="/promotions" replace /></AuthRoute>} />
                    <Route path="/promotions" element={<AuthRoute><PromotionsList isPremium={isPremium} onUpgradeToPremium={() => setShowSubscriptionModal(true)} /></AuthRoute>} />
                    <Route path="/promotion/:id" element={<AuthRoute><PromotionDetails /></AuthRoute>} />
                    <Route path="/search" element={<AuthRoute><Search /></AuthRoute>} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-use" element={<TermsOfUse />} />
                    <Route path="/cancellation-policy" element={<CancellationPolicy />} />
                    <Route path="/subscription-success" element={<AuthRoute><SubscriptionSuccess /></AuthRoute>} />
                    <Route path="/subscription-cancel" element={<AuthRoute><SubscriptionCancel /></AuthRoute>} />
                    <Route path="/admin-access" element={<AuthRoute><AdminAccess /></AuthRoute>} />
                    <Route path="/login" element={!isAuthenticated ? <Login onSwitchToRegister={() => setAuthMode('register')} /> : <Navigate to="/promotions" replace />} />
                    <Route path="/register" element={!isAuthenticated ? <Register onSwitchToLogin={() => setAuthMode('login')} /> : <Navigate to="/promotions" replace />} />
                    
                    {/* Account Routes */}
                    <Route path="/account" element={<AuthRoute><AccountLayout /></AuthRoute>}>
                      <Route index element={<AccountManagement />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="subscription" element={<SubscriptionPage />} />
                      <Route path="notifications" element={<NotificationsPage />} />
                      <Route path="security" element={<SecurityPage />} />
                    </Route>
                  </Routes>
                </div>
                
                {/* Footer for public routes */}
                <footer className="bg-white border-t border-gray-200 py-8">
                  <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div>
                        <div className="flex items-center mb-4">
                          <span className="text-lg font-semibold mr-1">passagensfy</span>
                          <div className="w-5 h-5 text-brand-purple">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                            </svg>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                          Sua plataforma para encontrar as melhores ofertas de passagens aéreas com descontos exclusivos.
                        </p>
                        <div className="flex space-x-4">
                          <a href="http://instagram.com/passagensfy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-purple">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Navegação</h3>
                        <ul className="space-y-2">
                          <li><a href="/promotions" className="text-gray-600 hover:text-brand-purple">Promoções</a></li>
                          <li><a href="/search" className="text-gray-600 hover:text-brand-purple">Busca Avançada</a></li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Suporte</h3>
                        <ul className="space-y-2">
                          <li><a href="/help" className="text-gray-600 hover:text-brand-purple">Central de Ajuda</a></li>
                          <li><a href="/contact" className="text-gray-600 hover:text-brand-purple">Contato</a></li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Legal</h3>
                        <ul className="space-y-2">
                          <li><a href="/terms-of-use" className="text-gray-600 hover:text-brand-purple">Termos de Uso</a></li>
                          <li><a href="/privacy" className="text-gray-600 hover:text-brand-purple">Política de Privacidade</a></li>
                          <li><a href="/cancellation-policy" className="text-gray-600 hover:text-brand-purple">Política de Cancelamento</a></li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-8 mt-8 text-sm text-gray-500 text-center">
                      <p>© 2025 passagensfy. Todos os direitos reservados.</p>
                    </div>
                  </div>
                </footer>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;