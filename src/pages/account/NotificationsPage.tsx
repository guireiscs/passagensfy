import React, { useState } from 'react';
import { Check } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    emailPromotions: true,
    emailNewsletters: true,
    pushNotifications: false,
    smsNotifications: true
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: checked
    });
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would save the preferences to your backend
    console.log('Saving preferences:', preferences);
    
    setIsSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Preferências de Notificações</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">Notificações por Email</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Promoções e Ofertas</p>
                <p className="text-sm text-gray-500">Receba alertas sobre as melhores promoções de passagens</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="emailPromotions"
                  checked={preferences.emailPromotions} 
                  onChange={handleCheckboxChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Newsletter Semanal</p>
                <p className="text-sm text-gray-500">Receba resumos semanais com as melhores ofertas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="emailNewsletters"
                  checked={preferences.emailNewsletters} 
                  onChange={handleCheckboxChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <h3 className="font-medium mb-4">Notificações Push</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertas no Navegador</p>
                <p className="text-sm text-gray-500">Receba notificações em tempo real no seu navegador</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="pushNotifications"
                  checked={preferences.pushNotifications} 
                  onChange={handleCheckboxChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <h3 className="font-medium mb-4">Notificações SMS</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertas SMS</p>
                <p className="text-sm text-gray-500">Receba ofertas exclusivas e urgentes por SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="smsNotifications"
                  checked={preferences.smsNotifications} 
                  onChange={handleCheckboxChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSavePreferences}
            disabled={isSaving}
            className="px-4 py-2 bg-brand-purple hover:bg-brand-dark text-white rounded-lg transition flex items-center"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-t-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Check size={16} className="mr-1" />
                Salvar preferências
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;