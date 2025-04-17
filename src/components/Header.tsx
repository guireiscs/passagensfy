import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  PlaneTakeoff, User, LogIn, LogOut, Menu, X, Search, 
  Crown, Bell, Shield
} from 'lucide-react';

interface HeaderProps {
  isLoggedIn: boolean;
  user: any;
  isPremium: boolean;
  isAdmin?: boolean;
  handleLogout: () => void;
  setShowSubscriptionModal: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isLoggedIn, 
  user, 
  isPremium, 
  isAdmin = false,
  handleLogout, 
  setShowSubscriptionModal 
}) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [notifications] = useState([
    { 
      id: 1, 
      message: 'Nova promoção: São Paulo para Paris por R$2499', 
      time: '5 min', 
      read: false 
    },
    { 
      id: 2, 
      message: 'Oferta relâmpago: 30% de desconto para Dubai', 
      time: '1 hora', 
      read: false 
    },
    { 
      id: 3, 
      message: 'Sua assinatura Premium foi renovada', 
      time: '1 dia', 
      read: true 
    }
  ]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      setScrollPosition(currentScrollPosition);
      setIsScrolled(currentScrollPosition > 50);
    };

    // Initial check
    handleScroll();
    
    // Add event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when changing routes
    setMobileMenuOpen(false);
    
    // Close all dropdowns when changing routes
    setProfileDropdownOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);
  
  // Simple approach to prevent scrolling when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      // Add a class to the html element instead of manipulating styles directly
      document.documentElement.classList.add('overflow-hidden');
    } else {
      document.documentElement.classList.remove('overflow-hidden');
    }
    
    return () => {
      // Cleanup
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [mobileMenuOpen]);
  
  // Add CSS to head for the overflow-hidden class
  useEffect(() => {
    // Create style element if it doesn't exist
    let styleEl = document.getElementById('mobile-menu-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'mobile-menu-styles';
      document.head.appendChild(styleEl);
    }
    
    // Define the CSS
    styleEl.textContent = `
      html.overflow-hidden {
        overflow: hidden !important;
        height: 100% !important;
      }
      html.overflow-hidden body {
        overflow: hidden !important;
        height: 100% !important;
        position: relative !important;
      }
      .mobile-menu-container {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 50;
        width: 100%;
        max-width: 320px;
        background: white;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }
      .mobile-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 40;
        transition: opacity 0.3s ease;
      }
    `;
    
    return () => {
      // Clean up
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, []);
  
  // Handle window resize to close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`sticky top-0 z-50 border-b border-gray-200 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
      } transition-all duration-300`}
    >
      <div className="container mx-auto px-4 py-3">
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center space-x-1 cursor-pointer z-10"
          >
            <span className="text-2xl font-light tracking-tight">passagensfy</span>
            <div className="w-6 h-6 text-brand-purple">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
              </svg>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn && (
              <>
                <Link 
                  to="/promotions"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isActive('/promotions') ? 'bg-gray-100 text-brand-purple' : 'hover:bg-gray-50'} transition-all`}
                >
                  <PlaneTakeoff size={18} />
                  <span className="font-medium">Promoções</span>
                </Link>
                
                <Link 
                  to="/search"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isActive('/search') ? 'bg-gray-100 text-brand-purple' : 'hover:bg-gray-50'} transition-all`}
                >
                  <Search size={18} />
                  <span className="font-medium">Busca Avançada</span>
                </Link>

                {isAdmin && (
                  <Link 
                    to="/admin"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isActive('/admin') ? 'bg-gray-100 text-brand-purple' : 'hover:bg-gray-50'} transition-all`}
                  >
                    <Shield size={18} />
                    <span className="font-medium">Administração</span>
                  </Link>
                )}
              </>
            )}
          </div>
          
          {/* User Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <Bell size={20} />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                  </button>
                  
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-20">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-700">Notificações</h3>
                        <button className="text-sm text-brand-purple hover:underline">
                          Marcar todas como lidas
                        </button>
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notification => (
                            <div 
                              key={notification.id}
                              className={`p-3 rounded-lg ${notification.read ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition`}
                            >
                              <div className="flex justify-between">
                                <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                                  {notification.message}
                                </p>
                                {!notification.read && (
                                  <span className="h-2 w-2 bg-brand-purple rounded-full ml-2 mt-1.5 flex-shrink-0"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{notification.time} atrás</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <Bell size={24} className="text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">Nenhuma notificação</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <Link 
                          to="/notifications"
                          className="text-brand-purple text-sm font-medium hover:underline flex justify-center"
                        >
                          Ver todas as notificações
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Premium Badge */}
                {!isPremium && (
                  <button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:shadow-md transition"
                  >
                    <Crown size={14} />
                    <span>Premium</span>
                  </button>
                )}
                
                {/* User Profile */}
                <div 
                  className="relative"
                  onMouseEnter={() => setProfileDropdownOpen(true)}
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full p-1 pl-3 hover:shadow-md transition">
                    <span className="text-sm font-medium">{user?.name}</span>
                    {isPremium ? (
                      <div className="bg-yellow-500 text-white rounded-full p-1">
                        <Crown size={16} />
                      </div>
                    ) : (
                      <div className="bg-gray-500 text-white rounded-full p-1">
                        <User size={16} />
                      </div>
                    )}
                  </button>
                  
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                      <div className="bg-gradient-to-r from-gray-900 to-brand-dark p-4 text-white">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {isPremium ? (
                              <div className="bg-yellow-500 text-white rounded-full p-2">
                                <Crown size={20} />
                              </div>
                            ) : (
                              <div className="bg-gray-500 text-white rounded-full p-2">
                                <User size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{user?.name}</p>
                            <p className="text-xs text-gray-300">{user?.email}</p>
                          </div>
                        </div>
                        {isPremium && (
                          <div className="mt-3 text-xs flex items-center">
                            <Crown size={12} className="text-yellow-400 mr-1" />
                            <span>Assinante Premium</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/account"
                          className={`flex items-center px-4 py-2 text-sm ${isActive('/account') ? 'text-brand-purple bg-purple-50' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                          <User size={16} className="mr-3" />
                          <span>Minha conta</span>
                        </Link>
                        <Link
                          to="/promotions"
                          className={`flex items-center px-4 py-2 text-sm ${isActive('/promotions') ? 'text-brand-purple bg-purple-50' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                          <PlaneTakeoff size={16} className="mr-3" />
                          <span>Minhas promoções</span>
                        </Link>
                        
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className={`flex items-center px-4 py-2 text-sm ${isActive('/admin') ? 'text-brand-purple bg-purple-50' : 'hover:bg-gray-50 text-gray-700'}`}
                          >
                            <Shield size={16} className="mr-3" />
                            <span>Painel Administrativo</span>
                          </Link>
                        )}
                        {!isPremium && (
                          <button
                            onClick={() => setShowSubscriptionModal(true)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            <Crown size={16} className="text-yellow-500 mr-3" />
                            <span>Upgrade para Premium</span>
                          </button>
                        )}
                        <Link
                          to="/help"
                          className={`flex items-center px-4 py-2 text-sm ${isActive('/help') ? 'text-brand-purple bg-purple-50' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Central de Ajuda</span>
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={16} className="mr-3" />
                          <span>Sair</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`text-sm font-medium px-3 py-2 rounded-lg ${isActive('/login') ? 'text-brand-purple bg-purple-50' : 'hover:bg-gray-50'}`}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-purple hover:bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm hover:shadow"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu} 
              className="p-2 rounded-full hover:bg-gray-100 transition menu-button"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
        
        {/* Mobile Menu - Completely redesigned */}
        {mobileMenuOpen && (
          <>
            <div 
              className="mobile-menu-overlay" 
              onClick={toggleMobileMenu}
              aria-hidden="true"
            ></div>
            <div 
              className={`mobile-menu-container ${
                mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <Link to="/" className="flex items-center space-x-1" onClick={toggleMobileMenu}>
                <span className="text-2xl font-light tracking-tight">passagensfy</span>
                <div className="w-6 h-6 text-brand-purple">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                  </svg>
                </div>
              </Link>
              <button onClick={toggleMobileMenu} className="p-2 rounded-full hover:bg-gray-100">
                <X className="h-6 w-6" />
              </button>
            </div>
            
                <div className="flex-grow overflow-y-auto">
                  <div className="p-4 pb-24">

                
                <nav className="space-y-3">
                  <Link 
                    to="/" 
                    className={`flex items-center py-3 px-4 rounded-lg ${isActive('/') ? 'bg-purple-50 text-brand-purple' : 'hover:bg-gray-50'}`}
                    onClick={toggleMobileMenu}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="font-medium">Início</span>
                  </Link>
                  
                  {isLoggedIn && (
                    <>
                      <Link 
                        to="/promotions" 
                        className={`flex items-center py-3 px-4 rounded-lg ${isActive('/promotions') ? 'bg-purple-50 text-brand-purple font-medium' : 'hover:bg-gray-50'}`}
                        onClick={toggleMobileMenu}
                      >
                        <PlaneTakeoff size={20} className="mr-3" />
                        <span className="font-medium">Promoções</span>
                      </Link>
                      
                      <Link 
                        to="/search" 
                        className={`flex items-center py-3 px-4 rounded-lg ${isActive('/search') ? 'bg-purple-50 text-brand-purple font-medium' : 'hover:bg-gray-50'}`}
                        onClick={toggleMobileMenu}
                      >
                        <Search size={20} className="mr-3" />
                        <span className="font-medium">Busca Avançada</span>
                      </Link>

                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          className={`flex items-center py-3 px-4 rounded-lg ${isActive('/admin') ? 'bg-purple-50 text-brand-purple font-medium' : 'hover:bg-gray-50'}`}
                          onClick={toggleMobileMenu}
                        >
                          <Shield size={20} className="mr-3" />
                          <span className="font-medium">Administração</span>
                        </Link>
                      )}
                    </>
                  )}
                  
                  {isLoggedIn && (
                    <>
                      <Link 
                        to="/account" 
                        className={`flex items-center py-3 px-4 rounded-lg ${isActive('/account') ? 'bg-purple-50 text-brand-purple font-medium' : 'hover:bg-gray-50'}`}
                        onClick={toggleMobileMenu}
                      >
                        <User size={20} className="mr-3" />
                        <span className="font-medium">Minha Conta</span>
                      </Link>
                    </>
                  )}
                  
                  <Link 
                    to="/help" 
                    className={`flex items-center py-3 px-4 rounded-lg ${isActive('/help') ? 'bg-purple-50 text-brand-purple font-medium' : 'hover:bg-gray-50'}`}
                    onClick={toggleMobileMenu}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Central de Ajuda</span>
                  </Link>
                  
                  <Link 
                    to="/contact" 
                    className={`flex items-center py-3 px-4 rounded-lg ${isActive('/contact') ? 'bg-purple-50 text-brand-purple font-medium' : 'hover:bg-gray-50'}`}
                    onClick={toggleMobileMenu}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Fale Conosco</span>
                  </Link>
                </nav>
              </div>
            </div>
            
                <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white z-10 shadow-inner">
              {isLoggedIn ? (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="mr-3">
                      {isPremium ? (
                        <div className="bg-yellow-500 text-white rounded-full p-2">
                          <Crown size={20} />
                        </div>
                      ) : (
                        <div className="bg-gray-500 text-white rounded-full p-2">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                      {isPremium && (
                        <div className="text-xs flex items-center text-yellow-600 mt-1">
                          <Crown size={12} className="mr-1" />
                          <span>Assinante Premium</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!isPremium && (
                    <button
                      onClick={() => {
                        setShowSubscriptionModal(true);
                        toggleMobileMenu();
                      }}
                      className="w-full mb-3 flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-2 px-4 rounded-lg text-sm font-medium"
                    >
                      <Crown size={16} />
                      <span>Assinar Premium</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    className="w-full flex items-center justify-center space-x-2 border border-red-200 text-red-600 py-2 px-4 rounded-lg text-sm font-medium"
                  >
                    <LogOut size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/login"
                    onClick={toggleMobileMenu}
                    className="w-full flex items-center justify-center border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-lg font-medium"
                  >
                    <LogIn size={16} className="mr-2" />
                    <span>Entrar</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMobileMenu}
                    className="w-full flex items-center justify-center bg-brand-purple hover:bg-brand-dark text-white py-2 px-4 rounded-lg font-medium transition"
                  >
                    <User size={16} className="mr-2" />
                    <span>Cadastrar</span>
                  </Link>
                </div>
              )}
            </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;