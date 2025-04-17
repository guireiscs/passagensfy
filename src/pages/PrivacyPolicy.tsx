import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, AlertCircle, CheckCircle, Lock } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
        <h1 className="text-3xl font-semibold mb-4">Política de Privacidade</h1>
        <p className="text-gray-600">
          Última atualização: 15 de Junho de 2025
        </p>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
        <div className="flex items-start">
          <AlertCircle size={24} className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-700">
              <strong>Resumo:</strong> Valorizamos sua privacidade e protegemos seus dados pessoais. Esta política explica como coletamos, usamos e 
              protegemos suas informações ao utilizar nossa plataforma. Ao usar o passagensfy, você concorda com a coleta e uso de informações de 
              acordo com esta política.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Introdução</h2>
          <p className="text-gray-700">
            O passagensfy ("nós", "nosso" ou "nossa") está comprometido em proteger a privacidade dos usuários ("você" ou "seu") de nosso site, 
            aplicativo móvel e serviços (coletivamente, os "Serviços"). Esta Política de Privacidade explica como coletamos, usamos, divulgamos, 
            transferimos e armazenamos suas informações quando você usa nossos Serviços. Ao acessar ou utilizar nossos Serviços, você concorda 
            com as práticas descritas nesta Política de Privacidade.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">2. Informações que Coletamos</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">2.1 Informações que você nos fornece</h3>
              <p className="text-gray-700 mb-2">
                Coletamos informações que você nos fornece diretamente, incluindo:
              </p>
              <ul className="list-disc pl-8 space-y-1 text-gray-700">
                <li><strong>Informações de cadastro:</strong> Nome, endereço de e-mail, número de telefone, senha e outras informações necessárias para criar e gerenciar sua conta.</li>
                <li><strong>Informações de perfil:</strong> Preferências de viagem, aeroportos de origem favoritos e destinos de interesse.</li>
                <li><strong>Informações de pagamento:</strong> Dados de cartão de crédito ou outras informações de pagamento para processamento de assinaturas Premium.</li>
                <li><strong>Comunicações:</strong> Informações que você fornece ao entrar em contato com nosso suporte ao cliente ou responder a pesquisas.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2">2.2 Informações coletadas automaticamente</h3>
              <p className="text-gray-700 mb-2">
                Quando você usa nossos Serviços, coletamos automaticamente certas informações, incluindo:
              </p>
              <ul className="list-disc pl-8 space-y-1 text-gray-700">
                <li><strong>Informações do dispositivo:</strong> Tipo de dispositivo, sistema operacional, identificadores exclusivos de dispositivo, endereço IP, navegador e informações da rede móvel.</li>
                <li><strong>Informações de uso:</strong> Como você interage com nossos Serviços, incluindo promoções visualizadas, links clicados, tempo gasto na plataforma e padrões de navegação.</li>
                <li><strong>Informações de localização:</strong> Sua localização aproximada com base no seu endereço IP ou, com sua permissão, sua localização precisa via GPS.</li>
                <li><strong>Cookies e tecnologias semelhantes:</strong> Informações coletadas através de cookies, web beacons e tecnologias similares para entender como você usa nossos Serviços.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2">2.3 Informações de terceiros</h3>
              <p className="text-gray-700 mb-2">
                Podemos receber informações sobre você de terceiros, incluindo:
              </p>
              <ul className="list-disc pl-8 space-y-1 text-gray-700">
                <li><strong>Redes sociais:</strong> Se você se conectar ou compartilhar informações com redes sociais através de nossos Serviços.</li>
                <li><strong>Parceiros comerciais:</strong> Companhias aéreas, agências de viagens e outros parceiros com os quais trabalhamos.</li>
                <li><strong>Provedores de serviços:</strong> Empresas que nos ajudam a fornecer e melhorar nossos Serviços.</li>
              </ul>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">3. Como Usamos Suas Informações</h2>
          <p className="text-gray-700 mb-4">
            Usamos as informações que coletamos para os seguintes fins:
          </p>
          <ul className="list-disc pl-8 space-y-2 text-gray-700">
            <li>
              <strong>Fornecer e melhorar nossos Serviços:</strong>
              <ul className="list-disc pl-8 mt-1 text-gray-700">
                <li>Criar e gerenciar sua conta</li>
                <li>Personalizar a experiência do usuário</li>
                <li>Processar pagamentos de assinaturas</li>
                <li>Fornecer suporte ao cliente</li>
                <li>Desenvolver novos recursos e melhorar os serviços existentes</li>
              </ul>
            </li>
            <li>
              <strong>Comunicação:</strong>
              <ul className="list-disc pl-8 mt-1 text-gray-700">
                <li>Enviar alertas sobre promoções de passagens aéreas</li>
                <li>Enviar comunicações relacionadas à sua conta e uso dos serviços</li>
                <li>Responder às suas solicitações e perguntas</li>
                <li>Enviar atualizações, notícias e conteúdo promocional (se você optou por recebê-los)</li>
              </ul>
            </li>
            <li>
              <strong>Análise e pesquisa:</strong>
              <ul className="list-disc pl-8 mt-1 text-gray-700">
                <li>Analisar o uso de nossos Serviços para entender as preferências dos usuários</li>
                <li>Realizar pesquisas para aprimorar nossos produtos e serviços</li>
                <li>Gerar dados estatísticos agregados sobre o uso de nossos Serviços</li>
              </ul>
            </li>
            <li>
              <strong>Segurança e proteção:</strong>
              <ul className="list-disc pl-8 mt-1 text-gray-700">
                <li>Detectar, prevenir e solucionar problemas técnicos</li>
                <li>Proteger contra atividades fraudulentas, uso indevido ou ilegal</li>
                <li>Aplicar nossos Termos de Uso e outras políticas</li>
              </ul>
            </li>
            <li>
              <strong>Requisitos legais:</strong>
              <ul className="list-disc pl-8 mt-1 text-gray-700">
                <li>Cumprir obrigações legais</li>
                <li>Responder a solicitações de autoridades governamentais</li>
                <li>Estabelecer, exercer ou defender direitos legais</li>
              </ul>
            </li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">4. Como Compartilhamos Suas Informações</h2>
          <p className="text-gray-700 mb-4">
            Podemos compartilhar suas informações com os seguintes tipos de terceiros:
          </p>
          <ul className="list-disc pl-8 space-y-2 text-gray-700">
            <li>
              <strong>Provedores de serviços:</strong> Empresas que prestam serviços em nosso nome, como processamento de pagamentos, análise de dados, entrega de e-mails, hospedagem, gerenciamento de banco de dados e outros serviços de tecnologia.
            </li>
            <li>
              <strong>Parceiros comerciais:</strong> Companhias aéreas, agências de viagens e outros parceiros com os quais trabalhamos para fornecer promoções de passagens aéreas.
            </li>
            <li>
              <strong>Afiliados:</strong> Empresas relacionadas ao passagensfy que compartilham propriedade ou controle comum.
            </li>
            <li>
              <strong>Compradores ou sucessores:</strong> Em caso de fusão, aquisição, reorganização, falência ou outro evento similar, suas informações podem ser transferidas como parte dos ativos comerciais.
            </li>
            <li>
              <strong>Conformidade legal:</strong> Quando acreditamos de boa-fé que a divulgação é necessária para cumprir a lei, proteger nossos direitos ou os direitos de outros, ou responder a processos judiciais.
            </li>
            <li>
              <strong>Com seu consentimento:</strong> Em outros casos, mediante seu consentimento expresso.
            </li>
          </ul>
          <p className="text-gray-700 mt-4">
            <strong>Importante:</strong> Não vendemos suas informações pessoais a terceiros para fins comerciais.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">5. Cookies e Tecnologias Semelhantes</h2>
          <p className="text-gray-700 mb-4">
            Utilizamos cookies, web beacons e tecnologias similares para coletar informações sobre como você usa nossos Serviços. Isso nos permite:
          </p>
          <ul className="list-disc pl-8 space-y-1 text-gray-700">
            <li>Lembrar suas preferências e configurações</li>
            <li>Entender como você navega em nosso site</li>
            <li>Personalizar sua experiência</li>
            <li>Melhorar nossos Serviços</li>
            <li>Exibir anúncios mais relevantes para você</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Você pode configurar seu navegador para recusar todos ou alguns cookies ou para alertá-lo quando sites definem ou acessam cookies. 
            No entanto, se você desativar ou recusar cookies, observe que algumas partes de nossos Serviços podem se tornar inacessíveis ou não 
            funcionar adequadamente.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">6. Seus Direitos e Escolhas</h2>
          <p className="text-gray-700 mb-4">
            Respeitamos seus direitos sobre seus dados pessoais. Dependendo da sua localização, você pode ter os seguintes direitos:
          </p>
          <ul className="list-disc pl-8 space-y-1 text-gray-700">
            <li><strong>Acesso:</strong> Solicitar uma cópia das informações pessoais que temos sobre você.</li>
            <li><strong>Correção:</strong> Solicitar a correção de informações imprecisas ou incompletas.</li>
            <li><strong>Exclusão:</strong> Solicitar a exclusão de suas informações pessoais em determinadas circunstâncias.</li>
            <li><strong>Restrição:</strong> Solicitar a restrição do processamento de suas informações em determinadas circunstâncias.</li>
            <li><strong>Portabilidade de dados:</strong> Solicitar uma cópia de suas informações em formato estruturado, comumente usado e legível por máquina.</li>
            <li><strong>Objeção:</strong> Opor-se ao processamento de suas informações em determinadas circunstâncias.</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Você também tem opções sobre como usamos suas informações:
          </p>
          <ul className="list-disc pl-8 space-y-1 text-gray-700">
            <li><strong>Comunicações de marketing:</strong> Você pode optar por não receber e-mails promocionais seguindo as instruções de cancelamento incluídas em tais e-mails ou ajustando suas preferências de notificação em sua conta.</li>
            <li><strong>Notificações push:</strong> Você pode desativar notificações push através das configurações do seu dispositivo.</li>
            <li><strong>Informações de conta:</strong> Você pode acessar e atualizar determinadas informações em sua conta através das configurações do perfil.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">7. Segurança de Dados</h2>
          <p className="text-gray-700 mb-4">
            Implementamos medidas de segurança técnicas, administrativas e físicas projetadas para proteger suas informações pessoais contra acesso não autorizado, uso indevido ou divulgação, incluindo:
          </p>
          <ul className="list-disc pl-8 space-y-1 text-gray-700">
            <li>Criptografia de dados sensíveis em trânsito e em repouso</li>
            <li>Sistemas de detecção de intrusão e firewalls</li>
            <li>Acesso restrito a informações pessoais apenas a funcionários autorizados</li>
            <li>Treinamento regular para nossa equipe sobre práticas de segurança de dados</li>
            <li>Revisões periódicas de nossas políticas e procedimentos de segurança</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Embora nos esforcemos para proteger suas informações pessoais, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro. Portanto, não podemos garantir sua segurança absoluta.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">8. Retenção de Dados</h2>
          <p className="text-gray-700 mb-4">
            Retemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos nesta Política de Privacidade, a menos que um período de retenção mais longo seja exigido ou permitido por lei. Os critérios usados para determinar nossos períodos de retenção incluem:
          </p>
          <ul className="list-disc pl-8 space-y-1 text-gray-700">
            <li>O tempo necessário para fornecer os Serviços solicitados</li>
            <li>Se você tem uma conta ativa (as informações são mantidas enquanto sua conta estiver ativa)</li>
            <li>Obrigações legais às quais estamos sujeitos</li>
            <li>Limitações legais aplicáveis</li>
            <li>Disputas pendentes ou potenciais</li>
            <li>Nossas necessidades comerciais legítimas</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Quando não precisarmos mais de suas informações pessoais, nós as excluiremos ou anonimizaremos. Se isso não for possível, armazenaremos suas informações pessoais de forma segura e as isolaremos de qualquer uso adicional até que seja possível sua exclusão.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">9. Transferências Internacionais de Dados</h2>
          <p className="text-gray-700">
            Como somos uma empresa brasileira, suas informações pessoais serão coletadas e processadas no Brasil. No entanto, também podemos transferir suas informações para outros países onde nossos provedores de serviços e parceiros estão localizados. Ao fornecer suas informações pessoais através de nossos Serviços, você concorda com essa transferência.
          </p>
          <p className="text-gray-700 mt-4">
            Tomaremos medidas para garantir que suas informações pessoais recebam um nível adequado de proteção nas jurisdições em que são processadas. Quando transferimos dados para fora do Brasil ou da UE/EEE, implementamos salvaguardas adequadas, como cláusulas contratuais padrão aprovadas pela Comissão Europeia ou outras medidas adequadas.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">10. Privacidade de Crianças</h2>
          <p className="text-gray-700">
            Nossos Serviços não são destinados a crianças menores de 13 anos, e não coletamos intencionalmente informações pessoais de crianças menores de 13 anos. Se tomarmos conhecimento de que coletamos ou recebemos informações pessoais de uma criança menor de 13 anos sem verificação do consentimento dos pais, excluiremos essas informações. Se você acredita que podemos ter informações de ou sobre uma criança menor de 13 anos, entre em contato conosco em <a href="mailto:privacidade@passagensfy.com" className="text-brand-purple hover:underline">privacidade@passagensfy.com</a>.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">11. Alterações nesta Política de Privacidade</h2>
          <p className="text-gray-700">
            Podemos atualizar esta Política de Privacidade periodicamente em resposta a mudanças legais, técnicas ou comerciais. Quando atualizarmos nossa Política de Privacidade, notificaremos você de acordo com a importância das mudanças que fizermos. Obteremos seu consentimento para quaisquer alterações materiais na Política de Privacidade, se e quando exigido pela lei de proteção de dados aplicável.
          </p>
          <p className="text-gray-700 mt-4">
            Incentivamos você a revisar periodicamente esta Política de Privacidade para obter as informações mais recentes sobre nossas práticas de privacidade. O uso continuado de nossos Serviços após a publicação de alterações a esta Política de Privacidade significa que você aceita essas alterações.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">12. Contato</h2>
          <p className="text-gray-700">
            Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade ou ao tratamento de suas informações pessoais, entre em contato conosco em:
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="font-medium mb-2">passagensfy</p>
            <p className="text-gray-700">Email: <a href="mailto:privacidade@passagensfy.com" className="text-brand-purple hover:underline">privacidade@passagensfy.com</a></p>
            <p className="text-gray-700">Endereço: Av. Paulista, 1000, São Paulo, SP, 01310-100, Brasil</p>
          </div>
          <p className="text-gray-700 mt-4">
            Responderemos à sua solicitação no prazo de 30 dias ou conforme exigido pela legislação aplicável.
          </p>
        </section>
      </div>
      
      <div className="mt-12 px-6 py-8 bg-purple-50 rounded-2xl border border-purple-100">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-purple-100 p-3 rounded-full">
            <Shield size={24} className="text-brand-purple" />
          </div>
        </div>
        <h3 className="text-xl font-medium text-center mb-4">Seu compromisso com a privacidade é importante para nós</h3>
        <p className="text-gray-700 text-center mb-6">
          No passagensfy, levamos a sério a proteção dos seus dados. Se você tiver dúvidas adicionais sobre como protegemos suas informações, 
          entre em contato com nossa equipe.
        </p>
        <div className="flex justify-center">
          <Link 
            to="/contact"
            className="bg-brand-purple hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Fale Conosco
          </Link>
        </div>
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
          <Link to="/terms-of-use" className="text-brand-purple hover:underline">Termos de Uso</Link>
          <Link to="/cancellation-policy" className="text-brand-purple hover:underline">Política de Cancelamento</Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;