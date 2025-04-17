import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, Clock, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    orderNumber: '',
    message: '',
    contactType: 'general',
    agreedToTerms: false
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (!formData.agreedToTerms) {
      setErrorMessage('Você precisa concordar com nossa política de privacidade.');
      return;
    }
    
    // Simulate form submission
    setFormStatus('submitting');
    setErrorMessage('');
    
    // Mock API call
    setTimeout(() => {
      // 90% chance of success
      if (Math.random() > 0.1) {
        setFormStatus('success');
        // Clear form
        setFormData({
          name: '',
          email: '',
          subject: '',
          orderNumber: '',
          message: '',
          contactType: 'general',
          agreedToTerms: false
        });
      } else {
        setFormStatus('error');
        setErrorMessage('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.');
      }
    }, 1500);
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold mb-4">Entre em Contato</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Estamos aqui para ajudar! Preencha o formulário abaixo ou use um dos nossos canais de contato alternativos.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Side - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">Envie uma mensagem</h2>
            
            {formStatus === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-green-800 mb-2">Mensagem enviada com sucesso!</h3>
                <p className="text-green-700 mb-6">
                  Obrigado por entrar em contato. Nossa equipe responderá sua mensagem em breve.
                </p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Enviar nova mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {formStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                      <span className="text-red-700">{errorMessage}</span>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Assunto
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Número do Pedido (se aplicável)
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                      placeholder="Ex: PF123456"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="contactType" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Contato<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="contactType"
                    name="contactType"
                    value={formData.contactType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                    required
                  >
                    <option value="general">Dúvida Geral</option>
                    <option value="booking">Problema com Reserva</option>
                    <option value="subscription">Assinatura Premium</option>
                    <option value="refund">Reembolso ou Cancelamento</option>
                    <option value="suggestion">Sugestão</option>
                    <option value="partnership">Parceria</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                    required
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onChange={handleCheckboxChange}
                      className="mt-1 text-brand-purple"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Concordo com a <Link to="/privacy" className="text-brand-purple hover:underline">Política de Privacidade</Link> e autorizo o tratamento dos meus dados pessoais para fins de atendimento à minha solicitação.
                    </span>
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="bg-brand-purple hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-medium transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
        
        {/* Right Side - Contact Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 mb-6">
            <h2 className="text-xl font-semibold mb-6">Outras formas de contato</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Mail className="h-6 w-6 text-brand-purple" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-gray-600 text-sm mb-1">Resposta em até 24 horas</p>
                  <a 
                    href="mailto:suporte@passagensfy.com" 
                    className="text-brand-purple font-medium hover:underline"
                  >
                    suporte@passagensfy.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <MessageSquare className="h-6 w-6 text-brand-purple" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Chat ao Vivo</h3>
                  <p className="text-gray-600 text-sm mb-1">Disponível de seg-sex, 9h às 18h</p>
                  <button className="text-brand-purple font-medium hover:underline">
                    Iniciar conversa
                  </button>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-brand-purple" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Telefone</h3>
                  <p className="text-gray-600 text-sm mb-1">Seg-sex, 9h às 18h</p>
                  <a 
                    href="tel:+551130304050" 
                    className="text-brand-purple font-medium hover:underline"
                  >
                    (11) 3030-4050
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <div className="flex items-start">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-brand-purple" />
              </div>
              <div>
                <h3 className="font-medium mb-2">Horário de Atendimento</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Chat e Telefone</strong></p>
                  <p>Segunda a Sexta: 9h às 18h</p>
                  <p>Sábado: 9h às 13h</p>
                  <p>Domingos e Feriados: Fechado</p>
                  
                  <p className="pt-3"><strong>Email</strong></p>
                  <p>Disponível 24/7</p>
                  <p>Tempo de resposta: até 24h</p>
                  <p>Em dias úteis: até 12h</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-6 bg-brand-purple rounded-2xl text-white">
            <h3 className="font-medium mb-3">Assinantes Premium</h3>
            <p className="opacity-90 mb-4">
              Assinantes do plano Premium têm acesso a canais de atendimento prioritários com tempo de resposta reduzido.
            </p>
            <Link
              to="/subscription-plans"
              className="inline-flex items-center bg-white text-brand-purple px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              <svg className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.5 6.5H22l-5.5 4.5 2 7L12 16.5 5.5 20l2-7L2 8.5h7.5L12 2z" />
              </svg>
              Conheça o Premium
            </Link>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-6 text-center">Perguntas Frequentes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-medium mb-2">Qual o prazo para resposta?</h3>
            <p className="text-gray-600">
              Respondemos emails em até 24 horas em dias úteis. Para assinantes Premium, o prazo é de até 12 horas.
              Chat e telefone fornecem atendimento imediato durante o horário comercial.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-medium mb-2">O que fazer em caso de emergência com minha viagem?</h3>
            <p className="text-gray-600">
              Em casos urgentes relacionados a voos nas próximas 24 horas, recomendamos entrar em contato diretamente com a companhia aérea
              ou agência onde foi realizada a compra. Você também pode nos contatar por telefone durante o horário comercial.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-medium mb-2">Posso solicitar reembolso através do suporte?</h3>
            <p className="text-gray-600">
              Não processamos reembolsos de passagens, pois não somos o fornecedor direto. Podemos orientá-lo sobre como proceder com a 
              companhia aérea ou agência responsável. Para reembolsos de assinaturas Premium, entre em contato conosco por email.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="font-medium mb-2">Não recebi resposta dentro do prazo, o que fazer?</h3>
            <p className="text-gray-600">
              Verifique sua pasta de spam ou lixo eletrônico. Se ainda não encontrar resposta, envie um novo email mencionando o contato anterior,
              ou entre em contato por telefone ou chat durante o horário comercial.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link 
            to="/help" 
            className="inline-flex items-center text-brand-purple font-medium hover:underline"
          >
            Ver todas as perguntas frequentes
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;