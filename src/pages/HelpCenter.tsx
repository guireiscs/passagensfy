import React, { useState } from 'react';
import { Search, ChevronDown, Mail, MessageSquare, Phone, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const faqCategories = [
    { id: 'all', name: 'Todas Categorias' },
    { id: 'account', name: 'Conta e Perfil' },
    { id: 'subscription', name: 'Assinatura Premium' },
    { id: 'bookings', name: 'Reservas e Pagamentos' },
    { id: 'travel', name: 'Viagens' },
    { id: 'refunds', name: 'Cancelamentos e Reembolsos' }
  ];
  
  const faqItems: FAQItem[] = [
    {
      question: 'Como funciona o passagensfy?',
      answer: 'O passagensfy é uma plataforma que encontra e compartilha as melhores promoções de passagens aéreas, tanto em reais quanto em milhas. Oferecemos dois tipos de planos: o gratuito, com acesso a ofertas básicas, e o Premium, com acesso a todas as promoções exclusivas e benefícios adicionais.',
      category: 'all'
    },
    {
      question: 'Como criar uma conta no passagensfy?',
      answer: 'Para criar uma conta, clique no botão "Cadastrar" no canto superior direito da página. Preencha o formulário com seu nome, e-mail e crie uma senha. Você também pode se cadastrar usando sua conta do Google para maior praticidade.',
      category: 'account'
    },
    {
      question: 'Esqueci minha senha. Como posso recuperá-la?',
      answer: 'Na página de login, clique em "Esqueceu a senha?". Informe o e-mail cadastrado e você receberá instruções para criar uma nova senha. Verifique também sua caixa de spam caso não encontre o e-mail na caixa de entrada.',
      category: 'account'
    },
    {
      question: 'Quais são os benefícios do plano Premium?',
      answer: 'O plano Premium oferece acesso a todas as promoções, incluindo as exclusivas com maiores descontos, alertas em tempo real para ofertas relâmpago, ofertas com milhas aéreas exclusivas e suporte prioritário para remarcações e cancelamentos.',
      category: 'subscription'
    },
    {
      question: 'Como cancelar minha assinatura Premium?',
      answer: 'Para cancelar sua assinatura, acesse sua conta, vá em "Assinatura" e clique em "Cancelar assinatura". Você continuará com acesso Premium até o final do período já pago. Após esse prazo, sua conta será convertida para o plano gratuito automaticamente.',
      category: 'subscription'
    },
    {
      question: 'Como são selecionadas as promoções?',
      answer: 'Nossa equipe especializada monitora constantemente os preços das passagens aéreas e seleciona apenas as melhores ofertas. Utilizamos tecnologia avançada para comparar preços históricos e garantir que as promoções apresentadas realmente ofereçam economia para nossos usuários.',
      category: 'all'
    },
    {
      question: 'Como faço para reservar uma passagem?',
      answer: 'Ao encontrar uma promoção que lhe interesse, clique em "Ver Oferta". Você será redirecionado para o site da companhia aérea ou agência de viagens onde poderá finalizar sua reserva. O passagensfy não vende passagens diretamente, apenas conecta você às melhores ofertas.',
      category: 'bookings'
    },
    {
      question: 'Os preços incluem taxas e impostos?',
      answer: 'Sim, os preços mostrados já incluem taxas e impostos, exceto quando especificado o contrário. Procuramos sempre mostrar o valor final para que você não tenha surpresas na hora de finalizar a compra.',
      category: 'bookings'
    },
    {
      question: 'Como saber se uma promoção é realmente boa?',
      answer: 'Todas as promoções que publicamos são analisadas comparando com preços históricos. Mostramos a porcentagem de desconto para cada oferta, ajudando você a entender o quão vantajosa é a promoção. No plano Premium, você também tem acesso ao histórico de preços de cada rota.',
      category: 'all'
    },
    {
      question: 'E se os preços mudarem após eu ver a promoção?',
      answer: 'Os preços das passagens aéreas são dinâmicos e podem mudar a qualquer momento. Por isso, sempre indicamos a data e hora da última verificação de cada oferta. Recomendamos que você faça a reserva o quanto antes, pois as melhores promoções costumam durar pouco tempo.',
      category: 'bookings'
    },
    {
      question: 'O que fazer se meu voo for cancelado?',
      answer: 'Em caso de cancelamento pela companhia aérea, entre em contato diretamente com a empresa onde você realizou a compra. Se você é assinante Premium, pode utilizar nosso suporte prioritário para ajudá-lo com remarcações e cancelamentos, fornecendo orientações sobre seus direitos.',
      category: 'refunds'
    },
    {
      question: 'Posso alterar a data da minha passagem?',
      answer: 'As condições para alterações de data dependem das regras da tarifa que você adquiriu. Geralmente, passagens promocionais têm menos flexibilidade. Consulte as condições no momento da compra ou entre em contato diretamente com a companhia aérea ou agência onde realizou a reserva.',
      category: 'travel'
    }
  ];
  
  const filteredFAQs = faqItems.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory || faq.category === 'all';
    
    return matchesSearch && matchesCategory;
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold mb-4">Como podemos ajudar?</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Encontre respostas para suas dúvidas sobre o passagensfy, promoções de passagens aéreas, assinaturas e muito mais.
        </p>
        
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por uma pergunta ou palavra-chave..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent shadow-sm"
          />
        </div>
      </div>
      
      {/* FAQ Categories */}
      <div className="mb-8">
        <div className="flex overflow-x-auto hide-scrollbar py-2 space-x-2">
          {faqCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 whitespace-nowrap rounded-full transition ${
                activeCategory === category.id
                  ? 'bg-brand-purple text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* FAQ List */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-12">
        <h2 className="text-xl font-semibold mb-6">Perguntas Frequentes</h2>
        
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-gray-400 text-4xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-500 mb-4">Tente usar termos diferentes ou entre em contato com nosso suporte.</p>
            <Link 
              to="/contact"
              className="text-brand-purple hover:text-brand-dark font-medium"
            >
              Falar com o suporte
            </Link>
          </div>
        ) : (
          <div className="space-y-4 divide-y divide-gray-100">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className={index === 0 ? '' : 'pt-4'}>
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-start text-left focus:outline-none group"
                >
                  <h3 className="text-lg font-medium text-gray-800 group-hover:text-brand-purple transition">
                    {faq.question}
                  </h3>
                  <div className={`ml-2 flex-shrink-0 mt-1.5 transform transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}>
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                </button>
                {expandedFaq === index && (
                  <div className="mt-2 text-gray-600">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-2xl shadow-card p-6 text-center hover:shadow-lg transition-shadow">
          <div className="bg-purple-100 p-3 inline-flex rounded-full mb-4">
            <Mail className="h-6 w-6 text-brand-purple" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Email</h3>
          <p className="text-gray-600 mb-4">Resposta em até 24 horas</p>
          <a 
            href="mailto:suporte@passagensfy.com" 
            className="text-brand-purple font-medium hover:underline"
          >
            suporte@passagensfy.com
          </a>
        </div>
        
        <div className="bg-white rounded-2xl shadow-card p-6 text-center hover:shadow-lg transition-shadow">
          <div className="bg-purple-100 p-3 inline-flex rounded-full mb-4">
            <MessageSquare className="h-6 w-6 text-brand-purple" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Chat ao Vivo</h3>
          <p className="text-gray-600 mb-4">Disponível de seg-sex, 9h às 18h</p>
          <button className="text-brand-purple font-medium hover:underline">
            Iniciar conversa
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-card p-6 text-center hover:shadow-lg transition-shadow">
          <div className="bg-purple-100 p-3 inline-flex rounded-full mb-4">
            <Phone className="h-6 w-6 text-brand-purple" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Telefone</h3>
          <p className="text-gray-600 mb-4">Seg-sex, 9h às 18h</p>
          <a 
            href="tel:+551130304050" 
            className="text-brand-purple font-medium hover:underline"
          >
            (11) 3030-4050
          </a>
        </div>
      </div>
      
      {/* Other Help Resources */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden mb-12">
        <div className="p-8 text-white">
          <h2 className="text-2xl font-semibold mb-6">Outros recursos de ajuda</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              to="/terms-of-use"
              className="bg-white/10 hover:bg-white/20 p-6 rounded-xl flex flex-col transition"
            >
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="font-semibold">Termos de Uso</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">Entenda os termos e condições para uso da plataforma passagensfy.</p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-sm hover:underline">
                  Ler termos
                  <ArrowRight size={14} className="ml-1" />
                </span>
              </div>
            </Link>
            
            <Link 
              to="/privacy"
              className="bg-white/10 hover:bg-white/20 p-6 rounded-xl flex flex-col transition"
            >
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="font-semibold">Política de Privacidade</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">Saiba como seus dados pessoais são coletados e utilizados.</p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-sm hover:underline">
                  Ler política
                  <ArrowRight size={14} className="ml-1" />
                </span>
              </div>
            </Link>
            
            <Link 
              to="/cancellation-policy"
              className="bg-white/10 hover:bg-white/20 p-6 rounded-xl flex flex-col transition"
            >
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="font-semibold">Políticas de Cancelamento</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">Informações sobre cancelamentos, reembolsos e alterações.</p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-sm hover:underline">
                  Ler política
                  <ArrowRight size={14} className="ml-1" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Support Hours */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-12">
        <div className="flex items-start">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <Clock className="h-6 w-6 text-brand-purple" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Horário de Atendimento</h2>
            <p className="text-gray-600 mb-4">
              Nossa equipe de suporte está disponível para atendê-lo nos seguintes horários:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Chat e Telefone</h3>
                <p className="text-gray-600">Segunda a Sexta: 9h às 18h</p>
                <p className="text-gray-600">Sábado: 9h às 13h</p>
                <p className="text-gray-600">Domingos e Feriados: Fechado</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Email</h3>
                <p className="text-gray-600">Disponível 24/7</p>
                <p className="text-gray-600">Tempo de resposta: até 24h</p>
                <p className="text-gray-600">Em dias úteis: até 12h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter */}
      <div className="bg-gray-100 rounded-2xl p-8 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Inscreva-se para receber nossas novidades</h2>
          <p className="text-gray-600 mb-6">Fique por dentro das melhores promoções de passagens e novidades do passagensfy.</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Seu melhor email"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            />
            <button className="bg-brand-purple hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-medium transition">
              Inscrever-se
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Ao se inscrever, você concorda com nossa <Link to="/privacy" className="underline">Política de Privacidade</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;