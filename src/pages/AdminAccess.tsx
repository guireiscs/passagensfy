import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, Shield, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminAccess: React.FC = () => {
  const { setAsAdmin, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRequestAdminAccess = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await setAsAdmin();
      
      if (result.success) {
        setSuccess(true);
        // Redirect to admin dashboard after a delay
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        setError(result.error || 'Ocorreu um erro ao processar sua solicitação');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao processar sua solicitação');
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-2xl shadow-card text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Você já tem acesso administrativo</h1>
          <p className="text-gray-600 mb-8">
            Você já possui acesso administrativo ao sistema. Use o painel administrativo para gerenciar o sistema.
          </p>
          
          <button
            onClick={() => navigate('/admin')}
            className="bg-brand-purple hover:bg-brand-dark text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Acessar Painel Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-2xl shadow-card">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={40} className="text-brand-purple" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Acesso Administrativo Requerido</h1>
          <p className="text-gray-600">
            Esta área é restrita aos administradores do sistema. Você precisa de privilégios especiais para acessar.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <CheckCircle2 size={40} className="text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-green-800 mb-2">Acesso Administrativo Concedido!</h2>
            <p className="text-green-700 mb-4">
              Seus privilégios administrativos foram ativados com sucesso. Você será redirecionado para o painel administrativo em instantes.
            </p>
            <div className="animate-pulse">Redirecionando...</div>
          </div>
        ) : (
          <>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Lock size={20} className="text-yellow-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Atenção:</strong> Ao solicitar acesso administrativo, você terá controle total sobre o sistema, incluindo gerenciamento de usuários, promoções e configurações.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4 flex items-center">
                  <Shield size={20} className="text-brand-purple mr-2" />
                  Privilégios Administrativos
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-brand-purple/10 mt-0.5 mr-3">
                      <span className="text-brand-purple text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">Acesso ao painel administrativo completo</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-brand-purple/10 mt-0.5 mr-3">
                      <span className="text-brand-purple text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">Gerenciamento de usuários e assinaturas</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-brand-purple/10 mt-0.5 mr-3">
                      <span className="text-brand-purple text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">Criação e edição de promoções</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-brand-purple/10 mt-0.5 mr-3">
                      <span className="text-brand-purple text-xs">✓</span>
                    </div>
                    <span className="text-gray-700">Acesso às configurações do sistema</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleRequestAdminAccess}
                  disabled={loading || success}
                  className={`flex items-center justify-center py-3 px-6 rounded-lg font-medium transition-colors ${
                    loading || success
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-brand-purple hover:bg-brand-dark text-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Shield size={18} className="mr-2" />
                      Tornar-me Administrador
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <button
            onClick={() => navigate('/promotions')}
            className="text-brand-purple hover:underline font-medium"
          >
            Voltar para o site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAccess;