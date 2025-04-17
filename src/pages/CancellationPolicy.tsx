import React from 'react';
import { AlertCircle, Check, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const CancellationPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold mb-4">Políticas de Cancelamento</h1>
        <p className="text-gray-600">
          Aqui você encontra informações sobre cancelamentos, reembolsos e alterações relacionadas a passagens aéreas e assinaturas do passagensfy.
        </p>
      </div>
      
      {/* Informational Alert */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
        <div className="flex items-start">
          <AlertCircle size={24} className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-700">
              <strong>Importante:</strong> O passagensfy é uma plataforma que encontra e compartilha promoções de passagens aéreas. 
              Não vendemos passagens diretamente. As políticas de cancelamento, reembolso e alteração de cada passagem dependem das 
              regras estabelecidas pela companhia aérea ou agência de viagens onde a compra foi realizada.
            </p>
          </div>
        </div>
      </div>
      
      {/* Sections */}
      <div className="space-y-12">
        {/* Airlines Policies */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Políticas de Companhias Aéreas</h2>
          <p className="text-gray-600 mb-6">
            Cada companhia aérea possui suas próprias regras e políticas de cancelamento e alteração. 
            Ao clicar em uma oferta no passagensfy, você é redirecionado para o site oficial da companhia ou agência, 
            onde deve verificar as condições específicas antes de finalizar sua compra.
          </p>
          
          <div className="bg-white rounded-xl shadow-card p-6 mb-8">
            <h3 className="text-lg font-medium mb-4">Principais Companhias Aéreas Brasileiras</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <img src="https://logo.clearbit.com/latamairlines.com" alt="LATAM" className="h-5 w-5 mr-2" />
                  LATAM
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Cancelamento gratuito em até 24 horas após a compra (para voos com mais de 7 dias de antecedência)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Taxas de cancelamento variam conforme a tarifa adquirida</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Remarcações podem ser feitas online mediante pagamento de taxa e diferença tarifária</span>
                  </li>
                </ul>
                <a href="https://www.latamairlines.com/br/pt/politicas-de-reembolso" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline text-sm flex items-center mt-2">
                  Ver política completa
                  <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
              
              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <img src="https://logo.clearbit.com/voegol.com.br" alt="GOL" className="h-5 w-5 mr-2" />
                  GOL
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Cancelamento gratuito em até 24 horas após a compra (para voos com mais de 7 dias de antecedência)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Reembolso parcial ou total dependendo da antecedência e tarifa</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Alterações podem ser realizadas mediante taxa e diferença tarifária</span>
                  </li>
                </ul>
                <a href="https://www.voegol.com.br/pt/informacoes/reembolso" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline text-sm flex items-center mt-2">
                  Ver política completa
                  <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
              
              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <img src="https://logo.clearbit.com/voeazul.com.br" alt="Azul" className="h-5 w-5 mr-2" />
                  Azul
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Cancelamento gratuito em até 24 horas após a compra (para voos com mais de 7 dias de antecedência)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Tarifas promocionais geralmente não são reembolsáveis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Alterações de data, horário ou rota estão sujeitas a taxas e diferença de tarifa</span>
                  </li>
                </ul>
                <a href="https://www.voeazul.com.br/para-sua-viagem/reembolso" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline text-sm flex items-center mt-2">
                  Ver política completa
                  <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">Dicas importantes</h3>
            
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5 mr-3">
                  <Check size={16} />
                </div>
                <span className="text-gray-700">Sempre leia atentamente as condições da tarifa antes de finalizar a compra.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5 mr-3">
                  <Check size={16} />
                </div>
                <span className="text-gray-700">Verifique se a tarifa permite cancelamentos, alterações e qual o valor das taxas aplicáveis.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5 mr-3">
                  <Check size={16} />
                </div>
                <span className="text-gray-700">Considere contratar um seguro viagem que ofereça cobertura para cancelamentos.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5 mr-3">
                  <Check size={16} />
                </div>
                <span className="text-gray-700">Em casos de cancelamentos por parte da companhia, você tem direito a reembolso total ou reacomodação.</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5 mr-3">
                  <Check size={16} />
                </div>
                <span className="text-gray-700">Assinantes Premium podem contar com nosso suporte para orientações sobre direitos e procedimentos.</span>
              </li>
            </ul>
          </div>
        </section>
        
        {/* Passagensfy Subscription Policies */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Política de Cancelamento de Assinatura</h2>
          <p className="text-gray-600 mb-6">
            Abaixo estão as políticas relacionadas ao cancelamento da sua assinatura Premium do passagensfy.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-medium mb-4">Cancelamento de Assinatura</h3>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full text-brand-purple mt-0.5 mr-3">
                    <Check size={16} />
                  </div>
                  <span className="text-gray-700">Você pode cancelar sua assinatura Premium a qualquer momento através da sua conta.</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full text-brand-purple mt-0.5 mr-3">
                    <Check size={16} />
                  </div>
                  <span className="text-gray-700">Após o cancelamento, você continuará com acesso Premium até o final do período já pago.</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full text-brand-purple mt-0.5 mr-3">
                    <Check size={16} />
                  </div>
                  <span className="text-gray-700">Não fazemos reembolsos proporcionais pelo período não utilizado da assinatura.</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full text-brand-purple mt-0.5 mr-3">
                    <Check size={16} />
                  </div>
                  <span className="text-gray-700">Ao final do período pago, sua conta será automaticamente convertida para o plano gratuito.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-medium mb-4">Reembolso da Assinatura</h3>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full text-brand-purple mt-0.5 mr-3">
                    <Check size={16} />
                  </div>
                  <span className="text-gray-700">Oferecemos garantia de satisfação de 7 dias para novos assinantes.</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full text-brand-purple mt-0.5 mr-3">
                    <Check size={16} />
                  </div>
                  <span className="text-gray-700">Se você solicitar o cancelamento em até 7 dias após a assinatura, faremos o reembolso integral.</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-red-100 p-1 rounded-full text-red-600 mt-0.5 mr-3">
                    <X size={16} />
                  </div>
                  <span className="text-gray-700">Após o período de 7 dias, não oferecemos reembolsos por cancelamentos.</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full text-brand-purple mt-0.5 mr-3">
                    <Check size={16} />
                  </div>
                  <span className="text-gray-700">Em casos excepcionais, entre em contato com nosso suporte para análise individual.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start">
              <ShieldCheck size={24} className="text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 mb-2">Como cancelar sua assinatura Premium</h3>
                <ol className="text-yellow-800 space-y-2 pl-6 list-decimal">
                  <li>Acesse sua conta no passagensfy</li>
                  <li>Navegue até "Minha Conta" &gt; "Assinatura"</li>
                  <li>Clique em "Cancelar assinatura"</li>
                  <li>Confirme o cancelamento</li>
                  <li>Você receberá um e-mail confirmando o cancelamento</li>
                </ol>
                <p className="mt-4 text-yellow-800">
                  Se precisar de ajuda, entre em contato com nossa equipe de suporte através do e-mail 
                  <a href="mailto:suporte@passagensfy.com" className="underline ml-1">suporte@passagensfy.com</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Consumer Rights */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Direitos do Consumidor</h2>
          <p className="text-gray-600 mb-6">
            Como consumidor, você possui direitos estabelecidos pelo Código de Defesa do Consumidor e por regulamentações da Agência Nacional de Aviação Civil (ANAC).
          </p>
          
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Principais direitos em relação a passagens aéreas</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Cancelamento pela companhia aérea</h4>
                <p className="text-gray-600">
                  Se a companhia aérea cancelar o voo, você tem direito a escolher entre:
                </p>
                <ul className="text-gray-600 space-y-1 mt-2 pl-5 list-disc">
                  <li>Reembolso integral do valor pago</li>
                  <li>Reacomodação em outro voo, mesmo que de outra companhia</li>
                  <li>Execução do serviço por outra modalidade de transporte</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Atrasos</h4>
                <p className="text-gray-600">
                  Em caso de atrasos, a companhia deve oferecer:
                </p>
                <ul className="text-gray-600 space-y-1 mt-2 pl-5 list-disc">
                  <li>A partir de 1 hora: comunicação (internet, telefone)</li>
                  <li>A partir de 2 horas: alimentação</li>
                  <li>A partir de 4 horas: acomodação ou hospedagem</li>
                  <li>A partir de 4 horas: opção de reembolso integral</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Arrependimento</h4>
                <p className="text-gray-600">
                  Você tem direito a desistir da compra em até 24 horas após o recebimento do comprovante, sem qualquer ônus, desde que a compra tenha sido feita com antecedência igual ou superior a 7 dias em relação à data do voo.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">Órgãos de Defesa do Consumidor</h3>
            
            <p className="text-gray-600 mb-4">
              Caso você tenha um problema com uma companhia aérea que não foi resolvido pelos canais de atendimento, pode recorrer aos seguintes órgãos:
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-gray-200 p-1 rounded-full mt-0.5 mr-3">
                  <span className="text-gray-700 text-xs font-bold">1</span>
                </div>
                <div>
                  <span className="font-medium">ANAC - Agência Nacional de Aviação Civil</span>
                  <p className="text-gray-600 text-sm">Para reclamações relacionadas a voos, cancelamentos e atrasos.</p>
                  <a href="https://www.gov.br/anac/pt-br/canais_atendimento/fale-com-a-anac" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline text-sm">www.gov.br/anac</a>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-gray-200 p-1 rounded-full mt-0.5 mr-3">
                  <span className="text-gray-700 text-xs font-bold">2</span>
                </div>
                <div>
                  <span className="font-medium">Procon</span>
                  <p className="text-gray-600 text-sm">Para questões relacionadas a direitos do consumidor em geral.</p>
                  <a href="https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/procon" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline text-sm">www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/procon</a>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-gray-200 p-1 rounded-full mt-0.5 mr-3">
                  <span className="text-gray-700 text-xs font-bold">3</span>
                </div>
                <div>
                  <span className="font-medium">Consumidor.gov.br</span>
                  <p className="text-gray-600 text-sm">Plataforma de resolução de conflitos entre consumidores e empresas.</p>
                  <a href="https://www.consumidor.gov.br/" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline text-sm">www.consumidor.gov.br</a>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>
      
      {/* Need Help Section */}
      <div className="bg-brand-purple rounded-2xl overflow-hidden mt-12">
        <div className="p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Ainda precisa de ajuda?</h2>
              <p className="opacity-90 mb-6 md:mb-0">
                Nossa equipe de suporte está pronta para esclarecer suas dúvidas sobre cancelamentos e reembolsos.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                to="/help" 
                className="bg-white text-brand-purple px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition text-center"
              >
                Central de Ajuda
              </Link>
              <Link 
                to="/contact" 
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition text-center"
              >
                Falar com Suporte
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Last Updated */}
      <div className="mt-12 text-sm text-gray-500 text-center">
        <p>Última atualização: 15 de Junho de 2025</p>
      </div>
    </div>
  );
};

export default CancellationPolicy;