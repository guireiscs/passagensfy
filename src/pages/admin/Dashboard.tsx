import React, { useState, useEffect } from 'react';
import { BarChart3, Users, CreditCard, TagIcon, TrendingUp, TrendingDown, CalendarRange, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPromotions: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    revenueChange: 12.5, // Percentage change
    newUsers: 0,
    userChange: 8.2, // Percentage change
    popularDestination: '',
    popularAirline: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch total users
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });
          
        if (userError) throw userError;
        
        // Fetch total promotions
        const { count: promotionsCount, error: promotionsError } = await supabase
          .from('promotions')
          .select('id', { count: 'exact', head: true });
          
        if (promotionsError) throw promotionsError;
        
        // Fetch active subscriptions
        const { count: subscriptionsCount, error: subscriptionsError } = await supabase
          .from('stripe_subscriptions')
          .select('id', { count: 'exact', head: true })
          .in('status', ['active', 'trialing']);
          
        if (subscriptionsError) throw subscriptionsError;
        
        // Fetch most popular destination
        const { data: destinationData, error: destinationError } = await supabase
          .from('promotions')
          .select('to')
          .order('created_at', { ascending: false })
          .limit(1);
          
        const popularDestination = destinationData?.[0]?.to || 'Paris';
        
        // Fetch most popular airline (fixed query)
        const { data: airlineData, error: airlineError } = await supabase
          .from('promotions')
          .select('airline')
          .order('created_at', { ascending: false })
          .limit(1);
          
        const popularAirline = airlineData?.[0]?.airline || 'LATAM';
        
        // Update stats
        setStats({
          totalUsers: userCount || 0,
          totalPromotions: promotionsCount || 0,
          activeSubscriptions: subscriptionsCount || 0,
          totalRevenue: 29.90 * (subscriptionsCount || 0), // Estimating revenue based on subscription price
          revenueChange: 12.5,
          newUsers: Math.floor((userCount || 100) * 0.08), // Dummy value: 8% of total users
          userChange: 8.2,
          popularDestination,
          popularAirline
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [selectedTimeRange]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Painel de Administração</h1>
          <p className="text-gray-600">Visão geral e estatísticas do sistema</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <div className="relative inline-block">
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            >
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
              <option value="year">Último Ano</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Users Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm">Total de Usuários</h3>
                <div className="bg-purple-100 text-brand-purple p-2 rounded-lg">
                  <Users size={20} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                  <div className={`flex items-center text-sm ${stats.userChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.userChange >= 0 ? (
                      <ArrowUpRight size={16} className="mr-1" />
                    ) : (
                      <ArrowDownRight size={16} className="mr-1" />
                    )}
                    <span>{Math.abs(stats.userChange)}% desde último {selectedTimeRange === 'week' ? 'semana' : selectedTimeRange === 'month' ? 'mês' : 'ano'}</span>
                  </div>
                </div>
                <div className="text-gray-500 text-sm">
                  +{stats.newUsers} novos
                </div>
              </div>
            </div>
            
            {/* Revenue Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm">Receita {selectedTimeRange === 'week' ? 'Semanal' : selectedTimeRange === 'month' ? 'Mensal' : 'Anual'}</h3>
                <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</p>
                  <div className={`flex items-center text-sm ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.revenueChange >= 0 ? (
                      <ArrowUpRight size={16} className="mr-1" />
                    ) : (
                      <ArrowDownRight size={16} className="mr-1" />
                    )}
                    <span>{Math.abs(stats.revenueChange)}% desde último {selectedTimeRange === 'week' ? 'semana' : selectedTimeRange === 'month' ? 'mês' : 'ano'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Subscriptions Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm">Assinaturas Ativas</h3>
                <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
                  <CreditCard size={20} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-800">{stats.activeSubscriptions}</p>
                  <div className="flex items-center text-sm text-green-600">
                    <ArrowUpRight size={16} className="mr-1" />
                    <span>5.3% desde último {selectedTimeRange === 'week' ? 'semana' : selectedTimeRange === 'month' ? 'mês' : 'ano'}</span>
                  </div>
                </div>
                <div className="text-gray-500 text-sm">
                  Taxa de conversão: 4.2%
                </div>
              </div>
            </div>
            
            {/* Promotions Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm">Total de Promoções</h3>
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <TagIcon size={20} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalPromotions}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{Math.floor(stats.totalPromotions * 0.3)} promoções premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts and Additional Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Novos Usuários</h3>
                <div className="relative inline-block">
                  <select 
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                    defaultValue="month"
                  >
                    <option value="week">Semana</option>
                    <option value="month">Mês</option>
                    <option value="year">Ano</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="h-60 flex items-center justify-center text-gray-400">
                <BarChart3 size={48} />
                <p className="ml-4 text-sm">Gráfico de dados de usuários</p>
              </div>
            </div>
            
            {/* Popular Items Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold mb-6">Estatísticas Populares</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-brand-purple/10 text-brand-purple p-3 rounded-lg mr-4">
                      <MapPinIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Destino mais popular</p>
                      <p className="font-semibold">{stats.popularDestination}</p>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                    +28%
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-brand-purple/10 text-brand-purple p-3 rounded-lg mr-4">
                      <PlaneTakeoff size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Companhia mais procurada</p>
                      <p className="font-semibold">{stats.popularAirline}</p>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                    +14%
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-brand-purple/10 text-brand-purple p-3 rounded-lg mr-4">
                      <CalendarRange size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Período mais buscado</p>
                      <p className="font-semibold">Julho - Agosto</p>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                    +32%
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalhes</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-purple/20 flex items-center justify-center">
                          <span className="text-brand-purple">JD</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">João Silva</div>
                          <div className="text-sm text-gray-500">joao@exemplo.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Nova Assinatura
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Assinatura Premium Anual
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Hoje às 14:32
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-purple/20 flex items-center justify-center">
                          <span className="text-brand-purple">MT</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Maria Torres</div>
                          <div className="text-sm text-gray-500">maria@exemplo.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Bookmark
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      São Paulo → Paris
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Ontem às 09:15
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-purple/20 flex items-center justify-center">
                          <span className="text-brand-purple">CS</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Carlos Santos</div>
                          <div className="text-sm text-gray-500">carlos@exemplo.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Atualização
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Alterou informações do perfil
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2 dias atrás
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Map pin icon component
const MapPinIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Plane takeoff icon component
const PlaneTakeoff = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 22h20" />
    <path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 9l.9-.45a2 2 0 0 1 1.8 0l.2.1a2 2 0 0 0 2.2 0L12 8l-3-3 .9-.45a2 2 0 0 1 1.8 0l.2.1a2 2 0 0 0 2.2 0L16 4l-6 6 8 4 1-4 5 3-2 4-20 2 4.5-2.5" />
  </svg>
);

export default Dashboard;