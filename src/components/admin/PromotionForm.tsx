import React, { useState, useEffect } from 'react';
import { X, Upload, PlaneTakeoff, Calendar, Crown, DollarSign, Coins, Plus } from 'lucide-react';

interface Promotion {
  id?: number;
  title?: string;
  from: string;
  to: string;
  price: number;
  miles?: number | null;
  airline: string;
  departure_date: string;
  return_date: string;
  image_url: string;
  discount: number;
  expires_in: string;
  is_premium: boolean;
  payment_type: 'cash' | 'miles';
  departure_time?: string | null;
  return_time?: string | null;
  baggage?: string | null;
  stopover?: string | null;
  flight_duration?: string | null;
  description?: string | null;
  terms?: string[] | null;
  trip_type: string;
  travel_class: string;
  link?: string | null;
}

interface PromotionFormProps {
  promotion: Promotion | null;
  onSubmit: (promotion: Partial<Promotion>, isNew: boolean) => void;
  onCancel: () => void;
}

const defaultPromotion: Promotion = {
  title: '',
  from: '',
  to: '',
  price: 0,
  miles: null,
  airline: '',
  departure_date: '',
  return_date: '',
  image_url: '',
  discount: 0,
  expires_in: '7 dias',
  is_premium: false,
  payment_type: 'cash',
  departure_time: '',
  return_time: '',
  baggage: 'Uma bagagem de mão (10kg)',
  stopover: 'Voo direto',
  flight_duration: '',
  description: '',
  terms: [],
  trip_type: 'round_trip',
  travel_class: 'economy',
  link: ''
};

const PromotionForm: React.FC<PromotionFormProps> = ({
  promotion,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<Promotion>>(promotion || defaultPromotion);
  const [termsInput, setTermsInput] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (promotion) {
      setFormData(promotion);
    }
  }, [promotion]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // For checkbox inputs
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: isChecked }));
    } 
    // For numeric inputs
    else if (type === 'number') {
      const numValue = name === 'price' || name === 'miles' || name === 'discount' 
        ? Number(value) 
        : value;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } 
    // For everything else
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleChangePaymentType = (type: 'cash' | 'miles') => {
    setFormData(prev => {
      // If changing from miles to cash, set miles to null and ensure price is set
      if (type === 'cash') {
        return { 
          ...prev, 
          payment_type: type,
          miles: null,
          price: prev.price || 0
        };
      } 
      // If changing from cash to miles, set price to 0 and ensure miles is set
      else {
        return { 
          ...prev, 
          payment_type: type,
          price: 0,
          miles: prev.miles || 0
        };
      }
    });
  };
  
  const handleAddTerm = () => {
    if (!termsInput.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      terms: [...(prev.terms || []), termsInput.trim()]
    }));
    
    setTermsInput('');
  };
  
  const handleRemoveTerm = (index: number) => {
    setFormData(prev => ({
      ...prev,
      terms: (prev.terms || []).filter((_, i) => i !== index)
    }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) newErrors.title = 'O título é obrigatório';
    if (!formData.from) newErrors.from = 'A origem é obrigatória';
    if (!formData.to) newErrors.to = 'O destino é obrigatório';
    if (formData.payment_type === 'cash' && (formData.price === undefined || formData.price <= 0)) {
      newErrors.price = 'O preço deve ser maior que zero';
    }
    if (formData.payment_type === 'miles' && (!formData.miles || formData.miles <= 0)) {
      newErrors.miles = 'As milhas devem ser maior que zero';
    }
    if (!formData.airline) newErrors.airline = 'A companhia aérea é obrigatória';
    if (!formData.departure_date) newErrors.departure_date = 'A data de partida é obrigatória';
    if (formData.trip_type !== 'one_way' && !formData.return_date) {
      newErrors.return_date = 'A data de retorno é obrigatória';
    }
    if (!formData.image_url) newErrors.image_url = 'A URL da imagem é obrigatória';
    if (formData.discount === undefined || formData.discount < 0 || formData.discount > 100) {
      newErrors.discount = 'O desconto deve estar entre 0 e 100%';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData, !promotion);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Pagamento
        </label>
        <div className="flex space-x-4">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border-2 ${
              formData.payment_type === 'cash' 
                ? 'border-brand-purple bg-brand-purple/5' 
                : 'border-gray-300 hover:border-gray-400'
            } transition-colors focus:outline-none`}
            onClick={() => handleChangePaymentType('cash')}
          >
            <DollarSign size={18} className={`mr-2 ${formData.payment_type === 'cash' ? 'text-brand-purple' : 'text-gray-500'}`} />
            <span className={formData.payment_type === 'cash' ? 'text-brand-purple font-medium' : 'text-gray-700'}>
              Dinheiro
            </span>
          </button>
          
          <button
            type="button"
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border-2 ${
              formData.payment_type === 'miles' 
                ? 'border-brand-purple bg-brand-purple/5' 
                : 'border-gray-300 hover:border-gray-400'
            } transition-colors focus:outline-none`}
            onClick={() => handleChangePaymentType('miles')}
          >
            <Coins size={18} className={`mr-2 ${formData.payment_type === 'miles' ? 'text-brand-purple' : 'text-gray-500'}`} />
            <span className={formData.payment_type === 'miles' ? 'text-brand-purple font-medium' : 'text-gray-700'}>
              Milhas
            </span>
          </button>
        </div>
      </div>
      
      {/* Premium Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Promoção
        </label>
        <div className="flex space-x-4">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border-2 ${
              !formData.is_premium 
                ? 'border-brand-purple bg-brand-purple/5' 
                : 'border-gray-300 hover:border-gray-400'
            } transition-colors focus:outline-none`}
            onClick={() => setFormData(prev => ({ ...prev, is_premium: false }))}
          >
            <span className={!formData.is_premium ? 'text-brand-purple font-medium' : 'text-gray-700'}>
              Free
            </span>
          </button>
          
          <button
            type="button"
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border-2 ${
              formData.is_premium 
                ? 'border-yellow-500 bg-yellow-50' 
                : 'border-gray-300 hover:border-gray-400'
            } transition-colors focus:outline-none`}
            onClick={() => setFormData(prev => ({ ...prev, is_premium: true }))}
          >
            <Crown size={18} className={`mr-2 ${formData.is_premium ? 'text-yellow-500' : 'text-gray-500'}`} />
            <span className={formData.is_premium ? 'text-yellow-700 font-medium' : 'text-gray-700'}>
              Premium
            </span>
          </button>
        </div>
      </div>
      
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título da Promoção*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
            placeholder="Ex: Passagens para Paris com 30% de desconto"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>
        
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
            Origem*
          </label>
          <input
            type="text"
            id="from"
            name="from"
            value={formData.from || ''}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.from ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
            placeholder="Ex: São Paulo"
          />
          {errors.from && <p className="mt-1 text-sm text-red-500">{errors.from}</p>}
        </div>
        
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
            Destino*
          </label>
          <input
            type="text"
            id="to"
            name="to"
            value={formData.to || ''}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.to ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
            placeholder="Ex: Paris"
          />
          {errors.to && <p className="mt-1 text-sm text-red-500">{errors.to}</p>}
        </div>
        
        {formData.payment_type === 'cash' ? (
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$)*
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price || 0}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-4 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
              placeholder="Ex: 2499.99"
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>
        ) : (
          <div>
            <label htmlFor="miles" className="block text-sm font-medium text-gray-700 mb-1">
              Milhas*
            </label>
            <input
              type="number"
              id="miles"
              name="miles"
              value={formData.miles || 0}
              onChange={handleChange}
              min="0"
              step="1"
              className={`w-full px-4 py-2 border ${errors.miles ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
              placeholder="Ex: 50000"
            />
            {errors.miles && <p className="mt-1 text-sm text-red-500">{errors.miles}</p>}
          </div>
        )}
        
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
            Desconto (%)*
          </label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount || 0}
            onChange={handleChange}
            min="0"
            max="100"
            className={`w-full px-4 py-2 border ${errors.discount ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
            placeholder="Ex: 30"
          />
          {errors.discount && <p className="mt-1 text-sm text-red-500">{errors.discount}</p>}
        </div>
        
        <div>
          <label htmlFor="airline" className="block text-sm font-medium text-gray-700 mb-1">
            Companhia Aérea*
          </label>
          <input
            type="text"
            id="airline"
            name="airline"
            value={formData.airline || ''}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.airline ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
            placeholder="Ex: LATAM"
          />
          {errors.airline && <p className="mt-1 text-sm text-red-500">{errors.airline}</p>}
        </div>
        
        <div>
          <label htmlFor="trip_type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Viagem*
          </label>
          <select
            id="trip_type"
            name="trip_type"
            value={formData.trip_type || 'round_trip'}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent appearance-none"
          >
            <option value="round_trip">Ida e volta</option>
            <option value="one_way">Somente ida</option>
            <option value="return_only">Somente volta</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="travel_class" className="block text-sm font-medium text-gray-700 mb-1">
            Classe de Viagem*
          </label>
          <select
            id="travel_class"
            name="travel_class"
            value={formData.travel_class || 'economy'}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent appearance-none"
          >
            <option value="economy">Econômica</option>
            <option value="premium_economy">Premium Economy</option>
            <option value="business">Executiva</option>
            <option value="first_class">Primeira Classe</option>
          </select>
        </div>
      </div>
      
      {/* Dates and Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="departure_date" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Ida*
          </label>
          <input
            type="text"
            id="departure_date"
            name="departure_date"
            value={formData.departure_date || ''}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.departure_date ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
            placeholder="Ex: 15/06/2025"
          />
          {errors.departure_date && <p className="mt-1 text-sm text-red-500">{errors.departure_date}</p>}
        </div>
        
        <div>
          <label htmlFor="departure_time" className="block text-sm font-medium text-gray-700 mb-1">
            Horário de Ida
          </label>
          <input
            type="text"
            id="departure_time"
            name="departure_time"
            value={formData.departure_time || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            placeholder="Ex: 08:30"
          />
        </div>
        
        {formData.trip_type !== 'one_way' && (
          <>
            <div>
              <label htmlFor="return_date" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Volta*
              </label>
              <input
                type="text"
                id="return_date"
                name="return_date"
                value={formData.return_date || ''}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.return_date ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
                placeholder="Ex: 22/06/2025"
              />
              {errors.return_date && <p className="mt-1 text-sm text-red-500">{errors.return_date}</p>}
            </div>
            
            <div>
              <label htmlFor="return_time" className="block text-sm font-medium text-gray-700 mb-1">
                Horário de Volta
              </label>
              <input
                type="text"
                id="return_time"
                name="return_time"
                value={formData.return_time || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                placeholder="Ex: 14:45"
              />
            </div>
          </>
        )}
      </div>
      
      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="stopover" className="block text-sm font-medium text-gray-700 mb-1">
            Conexões
          </label>
          <input
            type="text"
            id="stopover"
            name="stopover"
            value={formData.stopover || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            placeholder="Ex: Voo direto"
          />
        </div>
        
        <div>
          <label htmlFor="flight_duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duração do Voo
          </label>
          <input
            type="text"
            id="flight_duration"
            name="flight_duration"
            value={formData.flight_duration || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            placeholder="Ex: 2h 30min"
          />
        </div>
        
        <div>
          <label htmlFor="baggage" className="block text-sm font-medium text-gray-700 mb-1">
            Bagagem
          </label>
          <input
            type="text"
            id="baggage"
            name="baggage"
            value={formData.baggage || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            placeholder="Ex: Uma bagagem de mão (10kg)"
          />
        </div>
        
        <div>
          <label htmlFor="expires_in" className="block text-sm font-medium text-gray-700 mb-1">
            Expira em
          </label>
          <input
            type="text"
            id="expires_in"
            name="expires_in"
            value={formData.expires_in || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            placeholder="Ex: 7 dias"
          />
        </div>
      </div>
      
      {/* Description and Image */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
            URL da Imagem*
          </label>
          <div className="flex">
            <input
              type="text"
              id="image_url"
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.image_url ? 'border-red-500' : 'border-gray-300'} rounded-l-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
              placeholder="Ex: https://example.com/image.jpg"
            />
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-r-lg transition-colors"
              onClick={() => {
                // Ideally, this would open a file picker or a media library
                alert('Em um sistema real, isso abriria um seletor de arquivos ou biblioteca de mídia.');
              }}
            >
              <Upload size={18} />
            </button>
          </div>
          {errors.image_url && <p className="mt-1 text-sm text-red-500">{errors.image_url}</p>}
          {formData.image_url && (
            <div className="mt-2">
              <img 
                src={formData.image_url} 
                alt="Preview" 
                className="h-24 w-24 object-cover rounded-lg border border-gray-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Erro+na+Imagem';
                }}
              />
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
            Link da Promoção
          </label>
          <input
            type="text"
            id="link"
            name="link"
            value={formData.link || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            placeholder="Ex: https://www.latam.com/pt-br/promocao-especial/"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            placeholder="Descreva os detalhes da promoção..."
          ></textarea>
        </div>
      </div>
      
      {/* Terms and Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Termos e Condições
        </label>
        <div className="mb-2 flex">
          <input
            type="text"
            value={termsInput}
            onChange={(e) => setTermsInput(e.target.value)}
            placeholder="Adicione um termo ou condição"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTerm();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddTerm}
            className="px-4 py-2 bg-brand-purple hover:bg-brand-dark text-white rounded-r-lg transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        
        {(formData.terms || []).length > 0 ? (
          <ul className="space-y-2 bg-gray-50 p-4 rounded-lg">
            {(formData.terms || []).map((term, index) => (
              <li key={index} className="flex items-start">
                <div className="bg-brand-purple/10 p-1 rounded-full text-brand-purple mt-0.5 mr-2 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="flex-1 text-gray-700">{term}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTerm(index)}
                  className="ml-2 text-red-500 hover:text-red-700 p-1"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">Nenhum termo adicionado.</p>
        )}
      </div>
      
      {/* Form Actions */}
      <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand-purple hover:bg-brand-dark text-white rounded-lg transition-colors flex items-center"
        >
          <PlaneTakeoff size={18} className="mr-2" />
          <span>{promotion ? 'Atualizar' : 'Criar'} Promoção</span>
        </button>
      </div>
    </form>
  );
};

export default PromotionForm;