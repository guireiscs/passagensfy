import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const TermsOfUse: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link 
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-brand-purple mb-8"
      >
        <ArrowLeft size={16} className="mr-1" />
        <span>Voltar ao início</span>
      </Link>
      
      <div className="mb-10">
        <h1 className="text-3xl font-semibold mb-4">Termos de Uso</h1>
        <p className="text-gray-600">
          Última atualização: 15 de Junho de 2025
        </p>
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8 rounded-r-lg">
        <div className="flex items-start">
          <AlertCircle size={24} className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-700">
              <strong>Importante:</strong> Ao utilizar o passagensfy, você concorda com estes termos de uso. 
              Por favor, leia-os atentamente. Se você não concordar com qualquer parte destes termos, 
              pedimos que não utilize nossos serviços.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Aceitação dos Termos</h2>
          <p className="text-gray-700 mb-4">
            Ao acessar ou utilizar o site passagensfy, aplicativo móvel ou qualquer serviço oferecido pela passagensfy (coletivamente, os "Serviços"), 
            você concorda em obedecer e estar vinculado a estes Termos de Uso ("Termos"). Estes Termos constituem um acordo legal entre você e passagensfy.
          </p>
          <p className="text-gray-700">
            Reservamo-nos o direito de modificar estes Termos a qualquer momento, e tais modificações terão efeito imediato após a publicação.
            O uso contínuo dos nossos Serviços após quaisquer modificações constituirá sua aceitação dos Termos revisados.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">2. Descrição dos Serviços</h2>
          <p className="text-gray-700 mb-4">
            O passagensfy é uma plataforma que encontra e compartilha promoções de passagens aéreas. Nós não vendemos passagens aéreas diretamente.
            Ao clicar em uma oferta, você será redirecionado para o site da companhia aérea ou agência de viagens responsável pela venda das passagens.
          </p>
          <p className="text-gray-700">
            Oferecemos dois tipos de planos de serviço:
          </p>
          <ul className="list-disc pl-8 mt-2 space-y-1 text-gray-700">
            <li><strong>Plano Gratuito:</strong> Acesso a ofertas básicas de passagens aéreas.</li>
            <li><strong>Plano Premium:</strong> Acesso a todas as promoções, incluindo ofertas exclusivas, alertas em tempo real e suporte prioritário.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">3. Conta de Usuário</h2>
          <p className="text-gray-700 mb-4">
            Para utilizar determinados recursos dos nossos Serviços, você pode precisar criar uma conta. Ao criar uma conta, você concorda em:
          </p>
          <ul className="list-disc pl-8 space-y-1 text-gray-700">
            <li>Fornecer informações precisas, atuais e completas;</li>
            <li>Manter a confidencialidade da sua senha e ser responsável por todas as atividades que ocorrem em sua conta;</li>
            <li>Notificar-nos imediatamente sobre qualquer uso não autorizado da sua conta;</li>
            <li>Ser o único responsável por todo o conteúdo e atividades em sua conta.</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Reservamo-nos o direito de encerrar ou suspender contas a nosso critério, sem aviso prévio, por qualquer motivo, incluindo violação destes Termos.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">4. Preços e Disponibilidade</h2>
          <p className="text-gray-700 mb-4">
            As promoções e preços exibidos em nossa plataforma são obtidos diretamente das companhias aéreas, agências de viagens ou através de sistemas de busca de terceiros.
            Embora nos esforcemos para fornecer informações precisas e atualizadas, não podemos garantir a disponibilidade ou o preço exato das passagens, pois:
          </p>
          <ul className="list-disc pl-8 space-y-1 text-gray-700">
            <li>Os preços das passagens aéreas são dinâmicos e podem mudar a qualquer momento;</li>
            <li>A disponibilidade de assentos é limitada e pode se esgotar rapidamente;</li>
            <li>Os preços podem variar dependendo da localização geográfica, cookies, histórico de navegação ou outros fatores.</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Sempre indicamos a data e hora da última verificação de cada promoção. Recomendamos que os usuários finalizem a compra o mais rápido possível após encontrar uma oferta interessante.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">5. Assinaturas Premium</h2>
          <p className="text-gray-700 mb-4">
            As seguintes condições se aplicam às assinaturas do plano Premium:
          </p>
          <ul className="list-disc pl-8 space-y-1 text-gray-700">
            <li>Você será cobrado de acordo com o plano escolhido (mensal ou anual);</li>
            <li>As assinaturas são renovadas automaticamente até que você cancele;</li>
            <li>O cancelamento pode ser feito a qualquer momento através da sua conta;</li>
            <li>Após o cancelamento, você continuará com acesso Premium até o final do período já pago;</li>
            <li>Oferecemos garantia de satisfação de 7 dias para novos assinantes, com direito a reembolso integral se solicitado neste período.</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Para mais detalhes, consulte nossa <Link to="/cancellation-policy" className="text-brand-purple hover:underline">Política de Cancelamento</Link>.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">6. Uso Adequado</h2>
          <p className="text-gray-700 mb-4">
            Ao usar nossos Serviços, você concorda em não:
          </p>
          <ul className="list-disc pl-8 space-y-1 text-gray-700">
            <li>Violar leis, regulamentos ou direitos de terceiros;</li>
            <li>Distribuir vírus, malware ou outros códigos maliciosos;</li>
            <li>Interferir ou tentar interferir no funcionamento adequado dos Serviços;</li>
            <li>Coletar ou armazenar informações pessoais de outros usuários;</li>
            <li>Usar robôs, spiders, scrapers ou outros meios automatizados para acessar os Serviços sem nossa permissão expressa;</li>
            <li>Tentar contornar medidas de segurança ou de limitação de acesso;</li>
            <li>Compartilhar sua conta de assinante Premium com terceiros;</li>
            <li>Reproduzir, duplicar, copiar, vender ou revender qualquer parte dos Serviços.</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Reservamo-nos o direito de suspender ou encerrar o acesso de qualquer usuário que viole estas regras.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">7. Propriedade Intelectual</h2>
          <p className="text-gray-700 mb-4">
            Todos os direitos de propriedade intelectual relacionados aos Serviços, incluindo, mas não se limitando a, textos, gráficos, logotipos, 
            ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, são de propriedade exclusiva da passagensfy ou de seus licenciadores.
          </p>
          <p className="text-gray-700">
            Você não pode modificar, reproduzir, distribuir, criar trabalhos derivados, exibir publicamente, executar publicamente, republicar, baixar, 
            armazenar ou transmitir qualquer material de nossos Serviços, exceto conforme permitido por estes Termos.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">8. Conteúdo de Terceiros</h2>
          <p className="text-gray-700 mb-4">
            Nossos Serviços podem conter links para sites, aplicativos ou serviços de terceiros. Esses links são fornecidos apenas para sua conveniência.
            Não temos controle sobre o conteúdo ou as práticas desses sites e não somos responsáveis por eles.
          </p>
          <p className="text-gray-700">
            Ao acessar sites de terceiros a partir de links em nossos Serviços, você o faz por sua conta e risco. Recomendamos que você leia os termos e políticas de privacidade de qualquer site ou serviço de terceiros que você visite.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">9. Limitação de Responsabilidade</h2>
          <p className="text-gray-700 mb-4">
            Na extensão máxima permitida por lei, passagensfy e seus diretores, funcionários, agentes e afiliados não serão responsáveis por:
          </p>
          <ul className="list-disc pl-8 space-y-1 text-gray-700">
            <li>Quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes do uso ou incapacidade de uso dos Serviços;</li>
            <li>Quaisquer ações ou omissões de terceiros, incluindo companhias aéreas, agências de viagens ou outros usuários;</li>
            <li>Alterações de preços, disponibilidade de assentos ou outras condições das ofertas após a publicação em nossa plataforma;</li>
            <li>Problemas, cancelamentos, atrasos ou quaisquer outras questões relacionadas aos voos adquiridos através de ofertas encontradas em nossa plataforma;</li>
            <li>Interrupções, erros ou falhas nos Serviços.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">10. Indenização</h2>
          <p className="text-gray-700">
            Você concorda em indenizar, defender e isentar passagensfy e seus diretores, funcionários, agentes e afiliados de qualquer reclamação, 
            responsabilidade, dano, perda e despesa, incluindo honorários advocatícios razoáveis, decorrentes de ou de alguma forma relacionados ao 
            seu acesso ou uso dos Serviços, violação destes Termos ou violação de qualquer direito de terceiros.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">11. Lei Aplicável</h2>
          <p className="text-gray-700">
            Estes Termos são regidos e interpretados de acordo com as leis do Brasil. Qualquer disputa decorrente ou relacionada a estes Termos será submetida 
            à jurisdição exclusiva dos tribunais do Brasil.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">12. Disposições Gerais</h2>
          <ul className="list-disc pl-8 space-y-1 text-gray-700">
            <li><strong>Acordo Integral:</strong> Estes Termos, juntamente com nossa Política de Privacidade, constituem o acordo integral entre você e passagensfy em relação aos Serviços.</li>
            <li><strong>Divisibilidade:</strong> Se qualquer disposição destes Termos for considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor e efeito.</li>
            <li><strong>Renúncia:</strong> A falha da passagensfy em fazer valer qualquer direito ou disposição destes Termos não constituirá uma renúncia a tal direito ou disposição.</li>
            <li><strong>Cessão:</strong> Você não pode ceder ou transferir estes Termos, ou quaisquer direitos e licenças concedidos neste documento, sem o consentimento prévio por escrito da passagensfy.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">13. Contato</h2>
          <p className="text-gray-700">
            Se você tiver dúvidas ou preocupações sobre estes Termos, entre em contato conosco em <a href="mailto:juridico@passagensfy.com" className="text-brand-purple hover:underline">juridico@passagensfy.com</a>.
          </p>
        </section>
      </div>
      
      <div className="mt-12 flex items-center justify-between">
        <Link 
          to="/"
          className="text-gray-600 hover:text-brand-purple flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Voltar ao início</span>
        </Link>
        
        <div className="flex space-x-6">
          <Link to="/privacy" className="text-brand-purple hover:underline">Política de Privacidade</Link>
          <Link to="/cancellation-policy" className="text-brand-purple hover:underline">Política de Cancelamento</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;