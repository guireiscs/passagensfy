import React, { useState, useEffect } from 'react';
import { 
  Save, AlertTriangle, Check, Download, 
  Upload, RefreshCcw, Shield, Key, 
  Mail, Database, Globe
} from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'passagensfy',
    siteUrl: 'https://passagensfy.com',
    adminEmail: 'admin@passagensfy.com',
    supportEmail: 'suporte@passagensfy.com',
    defaultCurrency: 'BRL',
    newsletterEnabled: true,
    registrationEnabled: true,
    maintenanceMode: false,
    enablePromotionExpiration: true,
    enableUserAnalytics: true,
    enableNotifications: true,
    allowUserDeletion: false,
    apiTimeout: 30,
    itemsPerPage: 10,
    enableCronJobs: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  
  // Reset success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      // In a real app, you would save settings to the database
      // For this demo, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSaveSuccess(true);
    } catch (err) {
      setError('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleExportSettings = () => {
    // Create a JSON string of settings
    const settingsJson = JSON.stringify(settings, null, 2);
    
    // Create a blob and download
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passagensfy-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedSettings = JSON.parse(event.target?.result as string);
        setSettings(importedSettings);
      } catch (err) {
        setError('Arquivo de configurações inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Configurações</h1>
          <p className="text-gray-600">Gerencie as configurações do sistema</p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
          <button
            onClick={handleExportSettings}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Download size={18} className="mr-2" />
            <span>Exportar</span>
          </button>
          
          <label className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors cursor-pointer">
            <Upload size={18} className="mr-2" />
            <span>Importar</span>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportSettings}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-brand-purple hover:bg-brand-dark text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:bg-purple-300"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                <span>Salvar</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Success message */}
      {saveSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Configurações salvas com sucesso!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Settings Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'general' 
                  ? 'border-brand-purple text-brand-purple' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Globe size={16} className="inline-block mr-2" />
              Geral
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'email' 
                  ? 'border-brand-purple text-brand-purple' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Mail size={16} className="inline-block mr-2" />
              Email
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'security' 
                  ? 'border-brand-purple text-brand-purple' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield size={16} className="inline-block mr-2" />
              Segurança
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'api' 
                  ? 'border-brand-purple text-brand-purple' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Key size={16} className="inline-block mr-2" />
              API
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'database' 
                  ? 'border-brand-purple text-brand-purple' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Database size={16} className="inline-block mr-2" />
              Banco de Dados
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label 
                    htmlFor="siteName" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nome do Site
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="siteUrl" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    URL do Site
                  </label>
                  <input
                    type="text"
                    id="siteUrl"
                    name="siteUrl"
                    value={settings.siteUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="defaultCurrency" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Moeda Padrão
                  </label>
                  <select
                    id="defaultCurrency"
                    name="defaultCurrency"
                    value={settings.defaultCurrency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent appearance-none"
                  >
                    <option value="BRL">Real Brasileiro (BRL)</option>
                    <option value="USD">Dólar Americano (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">Libra Esterlina (GBP)</option>
                  </select>
                </div>
                
                <div>
                  <label 
                    htmlFor="itemsPerPage" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Itens por Página
                  </label>
                  <input
                    type="number"
                    id="itemsPerPage"
                    name="itemsPerPage"
                    value={settings.itemsPerPage}
                    onChange={handleInputChange}
                    min="5"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newsletterEnabled"
                    name="newsletterEnabled"
                    checked={settings.newsletterEnabled}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="newsletterEnabled" className="ml-2 text-sm text-gray-700">
                    Habilitar Newsletter
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="registrationEnabled"
                    name="registrationEnabled"
                    checked={settings.registrationEnabled}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="registrationEnabled" className="ml-2 text-sm text-gray-700">
                    Permitir Novos Registros
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-700">
                    Modo de Manutenção
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enablePromotionExpiration"
                    name="enablePromotionExpiration"
                    checked={settings.enablePromotionExpiration}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="enablePromotionExpiration" className="ml-2 text-sm text-gray-700">
                    Habilitar Expiração de Promoções
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableUserAnalytics"
                    name="enableUserAnalytics"
                    checked={settings.enableUserAnalytics}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="enableUserAnalytics" className="ml-2 text-sm text-gray-700">
                    Habilitar Análises de Usuário
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableNotifications"
                    name="enableNotifications"
                    checked={settings.enableNotifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="enableNotifications" className="ml-2 text-sm text-gray-700">
                    Habilitar Notificações
                  </label>
                </div>
                
              </div>
            </div>
          )}
          
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label 
                    htmlFor="adminEmail" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email do Administrador
                  </label>
                  <input
                    type="email"
                    id="adminEmail"
                    name="adminEmail"
                    value={settings.adminEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="supportEmail" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email de Suporte
                  </label>
                  <input
                    type="email"
                    id="supportEmail"
                    name="supportEmail"
                    value={settings.supportEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Configurações de SMTP não estão disponíveis nesta versão de demonstração. 
                      Em uma versão completa, você poderia configurar servidores SMTP, templates de email e agendamento aqui.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label 
                    htmlFor="sessionTimeout" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tempo Limite de Sessão (minutos)
                  </label>
                  <input
                    type="number"
                    id="sessionTimeout"
                    name="sessionTimeout"
                    defaultValue={60}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="maxLoginAttempts" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Máximo de Tentativas de Login
                  </label>
                  <input
                    type="number"
                    id="maxLoginAttempts"
                    name="maxLoginAttempts"
                    defaultValue={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="passwordPolicy" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Política de Senha
                  </label>
                  <select
                    id="passwordPolicy"
                    name="passwordPolicy"
                    defaultValue="medium"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent appearance-none"
                  >
                    <option value="low">Baixa (mínimo 6 caracteres)</option>
                    <option value="medium">Média (mínimo 8 caracteres, incluindo números)</option>
                    <option value="high">Alta (mínimo 10 caracteres, incluindo números e caracteres especiais)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableTwoFactor"
                    name="enableTwoFactor"
                    defaultChecked={false}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="enableTwoFactor" className="ml-2 text-sm text-gray-700">
                    Habilitar Autenticação de Dois Fatores
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowUserDeletion"
                    name="allowUserDeletion"
                    checked={settings.allowUserDeletion}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="allowUserDeletion" className="ml-2 text-sm text-gray-700">
                    Permitir que usuários excluam suas contas
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireEmailVerification"
                    name="requireEmailVerification"
                    defaultChecked={true}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="requireEmailVerification" className="ml-2 text-sm text-gray-700">
                    Exigir Verificação de Email
                  </label>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <RefreshCcw size={18} className="mr-2" />
                  <span>Redefinir Tokens de Sessão</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Isso encerrará todas as sessões de usuário ativas e forçará todos os usuários a fazer login novamente.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label 
                    htmlFor="apiKey" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Chave da API
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="apiKey"
                      name="apiKey"
                      value="sk_test_51QLqhGLwpTtdjQT7YxWLFdWxwIGjMN5Pd5OgZqJkOalDUkfmyXHC7y5zJRhzlBRKtqTNilkdK1nJRuaJNz2dZf3W00CRBLCJeP"
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent bg-gray-50"
                    />
                    <button
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-r-lg transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText('sk_test_51QLqhGLwpTtdjQT7YxWLFdWxwIGjMN5Pd5OgZqJkOalDUkfmyXHC7y5zJRhzlBRKtqTNilkdK1nJRuaJNz2dZf3W00CRBLCJeP');
                        alert('Chave da API copiada para a área de transferência!');
                      }}
                    >
                      Copiar
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Usada para autenticar solicitações de API. Mantenha esta chave segura!
                  </p>
                </div>
                
                <div>
                  <label 
                    htmlFor="apiTimeout" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tempo Limite de API (segundos)
                  </label>
                  <input
                    type="number"
                    id="apiTimeout"
                    name="apiTimeout"
                    value={settings.apiTimeout}
                    onChange={handleInputChange}
                    min="5"
                    max="120"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="webhookUrl" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    URL de Webhook
                  </label>
                  <input
                    type="text"
                    id="webhookUrl"
                    name="webhookUrl"
                    defaultValue="https://passagensfy.com/api/webhooks/stripe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL para receber notificações do Stripe e outros serviços.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enabledApi"
                    name="enabledApi"
                    defaultChecked={true}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="enabledApi" className="ml-2 text-sm text-gray-700">
                    Habilitar API
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rateLimiting"
                    name="rateLimiting"
                    defaultChecked={true}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="rateLimiting" className="ml-2 text-sm text-gray-700">
                    Habilitar Limitação de Taxa
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="logApiCalls"
                    name="logApiCalls"
                    defaultChecked={true}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="logApiCalls" className="ml-2 text-sm text-gray-700">
                    Registrar Chamadas de API
                  </label>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">Endpoints de API Disponíveis</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium mr-2">GET</span>
                    <span>/api/promotions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium mr-2">POST</span>
                    <span>/api/promotions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium mr-2">GET</span>
                    <span>/api/users</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium mr-2">PUT</span>
                    <span>/api/users/:id</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium mr-2">WEBHOOK</span>
                    <span>/api/webhooks/stripe</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">
                  <a href="#" className="text-brand-purple hover:underline">Ver documentação completa da API</a>
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Cuidado: Alterações nas configurações do banco de dados podem afetar a estabilidade do sistema.
                      Certifique-se de fazer um backup antes de qualquer alteração.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label 
                    htmlFor="dbConnectionPool" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tamanho do Pool de Conexão
                  </label>
                  <input
                    type="number"
                    id="dbConnectionPool"
                    name="dbConnectionPool"
                    defaultValue={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="dbTimeout" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tempo Limite de Consulta (segundos)
                  </label>
                  <input
                    type="number"
                    id="dbTimeout"
                    name="dbTimeout"
                    defaultValue={30}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableCronJobs"
                    name="enableCronJobs"
                    checked={settings.enableCronJobs}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="enableCronJobs" className="ml-2 text-sm text-gray-700">
                    Habilitar Trabalhos Cron (limpeza de dados, verificações de status, etc.)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableDbLogging"
                    name="enableDbLogging"
                    defaultChecked={true}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="enableDbLogging" className="ml-2 text-sm text-gray-700">
                    Habilitar Registro Detalhado do Banco de Dados
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableQueryCache"
                    name="enableQueryCache"
                    defaultChecked={true}
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="enableQueryCache" className="ml-2 text-sm text-gray-700">
                    Habilitar Cache de Consulta
                  </label>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  onClick={() => alert('Backup iniciado! (Simulado)')}
                >
                  <Download size={18} className="mr-2" />
                  <span>Fazer Backup</span>
                </button>
                
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  onClick={() => {
                    if (window.confirm('Tem certeza de que deseja limpar o cache? Isso pode afetar temporariamente o desempenho.')) {
                      alert('Cache limpo com sucesso! (Simulado)');
                    }
                  }}
                >
                  <RefreshCcw size={18} className="mr-2" />
                  <span>Limpar Cache</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;