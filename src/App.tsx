import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Home, 
  MessageCircle, 
  Users, 
  Settings, 
  Calendar as CalendarIcon, 
  Mail, 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard,
  Megaphone,
  PieChart,
  Star,
  CheckCircle2,
  X,
  Eye,
  RefreshCw,
  ChevronDown,
  HelpCircle
} from 'lucide-react';

import { CalendarScreen } from './screens/CalendarScreen';

// --- Tipos ---

// --- Dados Mockados ---

// --- Componentes ---
const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: any) => void }) => (
  <div className="w-16 bg-[#0854ce] h-screen flex flex-col items-center py-6 space-y-8 text-white/70 shrink-0 z-20">
    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm overflow-hidden">
      <img src="https://www.inbox.userevi.com/logo192.png" alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
    </div>
    <button onClick={() => setActiveTab('home')} className={`transition-colors p-2 rounded-lg ${activeTab === 'home' ? 'bg-white/20 text-white' : 'hover:text-white'}`}><Home size={22} /></button>
    <button className="hover:text-white transition-colors"><MessageCircle size={22} /></button>
    <button className="hover:text-white transition-colors"><Users size={22} /></button>
    <button className="hover:text-white transition-colors"><Megaphone size={22} /></button>
    <button onClick={() => setActiveTab('calendar')} className={`transition-colors p-2 rounded-lg ${activeTab === 'calendar' ? 'bg-white/20 text-white' : 'hover:text-white'}`}><CalendarIcon size={22} /></button>
    <button className="hover:text-white transition-colors"><PieChart size={22} /></button>
    
    <div className="mt-auto pt-8">
      <button className="hover:text-white transition-colors"><Settings size={22} /></button>
    </div>
  </div>
);





// --- Dashboard Components & Data ---
const RECOMMENDATIONS = [
  { id: 1, title: 'Reative 4848 Clientes em Risco', desc: 'Não perca clientes valiosos! Lance uma campanha para reativar clientes estratégicos e aumentar as chances de recompra.', stat: 'Clientes reativados têm até 3x mais chances de voltar a comprar.', icon: '🔥', color: 'bg-red-50 text-red-600' },
  { id: 2, title: 'Recompense a Confiança de 3036 Clientes', desc: 'Transforme compradores recorrentes em clientes fiéis com um incentivo para a próxima compra. Um desconto ou brinde pode fazer toda a diferença!', stat: '45% dos clientes fazem uma segunda compra mais rápido quando recebem um incentivo personalizado.', icon: '🙏', color: 'bg-blue-50 text-blue-600' },
  { id: 3, title: '2382 Clientes Prontos para Comprar!', desc: 'Aproveite essa oportunidade! Esses clientes já confiam na sua marca e estão mais propensos a comprar. Crie uma campanha e impulsione suas vendas.', stat: 'Clientes fiéis geram até 80% mais receita do que novos clientes.', icon: '🚀', color: 'bg-green-50 text-green-600' },
  { id: 4, title: 'Presente Especial para 1695 Clientes Fiéis', desc: 'Recompense clientes fiéis com um programa de benefícios, descontos progressivos ou brindes exclusivos.', stat: 'Clientes que sentem reconhecimento têm 2x mais chances de indicar sua marca para amigos.', icon: '🎁', color: 'bg-emerald-50 text-emerald-600' },
];

const FREQUENCY_DATA = [
  { name: '1 pedido', value: 15307, percent: '100%' },
  { name: '+2 pedidos', value: 11026, percent: '72.03%' },
  { name: '+3 pedidos', value: 2753, percent: '17.99%' },
  { name: '+4 pedidos', value: 1723, percent: '11.26%' },
  { name: '+5 pedidos', value: 799, percent: '5.22%' },
  { name: '+6 pedidos', value: 509, percent: '3.33%' },
  { name: '+7 pedidos', value: 292, percent: '1.9%' },
];

const COHORT_DATA = [
  { cohort: '03/2025', values: [100, 15, 13, 5, 13, 11, 8, 6, 6, 4, 1, 3, 2] },
  { cohort: '04/2025', values: [100, 13, 7, 9, 7, 5, 4, 2, 1, 2, 1, null, null] },
  { cohort: '05/2025', values: [100, 9, 10, 6, 5, 4, 5, 2, 0, 1, null, null, null] },
  { cohort: '06/2025', values: [100, 8, 5, 4, 3, 3, 1, 1, 1, null, null, null, null] },
  { cohort: '07/2025', values: [100, 9, 9, 7, 8, 3, 1, 2, null, null, null, null, null] },
];

const RFM_CHANGES_DATA = [
  { name: 'Campeões', values: [284, 14, 38, 21, 14, 1, 1, 3, 1, 2, '-'] },
  { name: 'Clientes Fiéis', values: ['-', 1592, 56, '-', '-', 81, '-', '-', '-', '-', '-'] },
  { name: 'Potenciais Fiéis', values: [2, 6, 2214, 188, 340, '-', 1, '-', '-', '-', 2] },
  { name: 'Clientes Recentes', values: [1, '-', '-', 153, '-', '-', '-', '-', '-', '-', '-'] },
  { name: 'Promissores', values: ['-', 3, '-', '-', 1581, '-', '-', '-', '-', '-', '-'] },
];

const DateRangePicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rangeType, setRangeType] = useState('7days');
  const [customStart, setCustomStart] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [customEnd, setCustomEnd] = useState(format(new Date(), 'yyyy-MM-dd'));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (type: string) => {
    setRangeType(type);
    if (type !== 'custom') {
      setIsOpen(false);
    }
  };

  const getDisplayValue = () => {
    const today = new Date();
    let start, end;
    
    switch (rangeType) {
      case '7days':
        start = subDays(today, 7);
        end = today;
        break;
      case '14days':
        start = subDays(today, 14);
        end = today;
        break;
      case 'thisMonth':
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      case 'custom':
        try {
          start = parseISO(customStart);
          end = parseISO(customEnd);
        } catch {
          start = subDays(today, 7);
          end = today;
        }
        break;
      default:
        start = subDays(today, 7);
        end = today;
    }

    try {
      return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
      >
        <CalendarIcon size={14} className="text-gray-500" />
        <span>{getDisplayValue()}</span>
        <ChevronDown size={14} className="text-gray-400 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex flex-col gap-1">
          <button 
            onClick={() => handleSelect('7days')}
            className={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${rangeType === '7days' ? 'bg-blue-50 text-[#0854ce] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Últimos 7 dias
          </button>
          <button 
            onClick={() => handleSelect('14days')}
            className={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${rangeType === '14days' ? 'bg-blue-50 text-[#0854ce] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Últimos 14 dias
          </button>
          <button 
            onClick={() => handleSelect('thisMonth')}
            className={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${rangeType === 'thisMonth' ? 'bg-blue-50 text-[#0854ce] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Este mês
          </button>
          <button 
            onClick={() => handleSelect('custom')}
            className={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${rangeType === 'custom' ? 'bg-blue-50 text-[#0854ce] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Personalizado
          </button>

          {rangeType === 'custom' && (
            <div className="mt-2 p-2 border-t border-gray-100 flex flex-col gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data Inicial</label>
                <input 
                  type="date" 
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-md p-1.5 focus:outline-none focus:border-[#0854ce]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data Final</label>
                <input 
                  type="date" 
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-md p-1.5 focus:outline-none focus:border-[#0854ce]"
                />
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="mt-2 w-full bg-[#0854ce] text-white text-xs font-medium py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Aplicar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ title, value, icon, color }: any) => (
  <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${color}`}>
      {typeof icon === 'string' ? icon : icon}
    </div>
    <div>
      <div className="flex items-center gap-1 mb-0.5">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{title}</span>
        <HelpCircle size={12} className="text-gray-400" />
      </div>
      <span className="text-xl font-bold text-gray-900">{value}</span>
    </div>
  </div>
);

const RecommendationCard = ({ title, desc, stat, icon, color }: any) => (
  <div className="min-w-[300px] w-[300px] bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col snap-start hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3 mb-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 leading-tight">{title}</h3>
    </div>
    <p className="text-sm text-gray-600 mb-6 flex-1">{desc}</p>
    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
      <p className="text-xs text-gray-500 flex items-start gap-2">
        <span className="text-base leading-none">💡</span>
        <span>{stat}</span>
      </p>
    </div>
  </div>
);

const RFMMatrix = () => (
  <div className="flex flex-col h-[400px] gap-1 text-sm rounded-xl overflow-hidden border border-gray-200">
    <div className="flex h-[25%] gap-1">
      <div className="w-[40%] bg-red-100 hover:bg-red-200 transition-colors p-4 flex flex-col items-end justify-start cursor-pointer">
        <span className="font-medium text-red-900">Não pode perder</span>
        <span className="font-bold text-red-700 flex items-center gap-1"><Users size={12}/> 1422</span>
        <span className="text-xs text-red-600">9.15%</span>
      </div>
      <div className="w-[40%] bg-emerald-100 hover:bg-emerald-200 transition-colors p-4 flex flex-col items-end justify-start cursor-pointer">
        <span className="font-medium text-emerald-900">Clientes fiéis</span>
        <span className="font-bold text-emerald-700 flex items-center gap-1"><Users size={12}/> 1695</span>
        <span className="text-xs text-emerald-600">10.90%</span>
      </div>
      <div className="w-[20%] bg-emerald-200 hover:bg-emerald-300 transition-colors p-4 flex flex-col items-end justify-start cursor-pointer">
        <span className="font-medium text-emerald-950">Campeões</span>
        <span className="font-bold text-emerald-800 flex items-center gap-1"><Users size={12}/> 687</span>
        <span className="text-xs text-emerald-700">4.42%</span>
      </div>
    </div>
    <div className="flex h-[50%] gap-1">
      <div className="w-[40%] bg-orange-100 hover:bg-orange-200 transition-colors p-4 flex flex-col items-end justify-start cursor-pointer">
        <span className="font-medium text-orange-900">Em risco</span>
        <span className="font-bold text-orange-700 flex items-center gap-1"><Users size={12}/> 3426</span>
        <span className="text-xs text-orange-600">22.04%</span>
      </div>
      <div className="w-[20%] bg-yellow-100 hover:bg-yellow-200 transition-colors p-4 flex flex-col items-end justify-start cursor-pointer">
        <span className="font-medium text-yellow-900">Precisam de atenção</span>
        <span className="font-bold text-yellow-700 flex items-center gap-1"><Users size={12}/> 447</span>
        <span className="text-xs text-yellow-600">2.88%</span>
      </div>
      <div className="w-[40%] bg-blue-100 hover:bg-blue-200 transition-colors p-4 flex flex-col items-end justify-start cursor-pointer">
        <span className="font-medium text-blue-900">Potenciais fiéis</span>
        <span className="font-bold text-blue-700 flex items-center gap-1"><Users size={12}/> 3036</span>
        <span className="text-xs text-blue-600">19.53%</span>
      </div>
    </div>
    <div className="flex h-[25%] gap-1">
      <div className="w-[20%] bg-gray-500 hover:bg-gray-600 transition-colors text-white p-4 flex flex-col items-end justify-start cursor-pointer">
        <span className="font-medium">Perdidos</span>
        <span className="font-bold flex items-center gap-1"><Users size={12}/> 246</span>
        <span className="text-xs text-gray-200">1.58%</span>
      </div>
      <div className="w-[20%] bg-gray-200 hover:bg-gray-300 transition-colors p-4 flex flex-col items-end justify-start cursor-pointer">
        <span className="font-medium text-gray-800">Hibernando</span>
        <span className="font-bold text-gray-700 flex items-center gap-1"><Users size={12}/> 1074</span>
        <span className="text-xs text-gray-600">6.91%</span>
      </div>
      <div className="w-[20%] bg-blue-50 hover:bg-blue-100 transition-colors p-4 flex flex-col items-end justify-start cursor-pointer">
        <span className="font-medium text-blue-900">Prestes a dormir</span>
        <span className="font-bold text-blue-700 flex items-center gap-1"><Users size={12}/> 1596</span>
        <span className="text-xs text-blue-600">10.27%</span>
      </div>
      <div className="w-[20%] bg-gray-100 hover:bg-gray-200 transition-colors p-4 flex flex-col items-end justify-start cursor-pointer">
        <span className="font-medium text-gray-800">Promissores</span>
        <span className="font-bold text-gray-700 flex items-center gap-1"><Users size={12}/> 1593</span>
        <span className="text-xs text-gray-600">10.25%</span>
      </div>
      <div className="w-[20%] bg-red-50 hover:bg-red-100 transition-colors p-4 flex flex-col items-end justify-start cursor-pointer">
        <span className="font-medium text-red-900">Clientes recentes</span>
        <span className="font-bold text-red-700 flex items-center gap-1"><Users size={12}/> 325</span>
        <span className="text-xs text-red-600">2.09%</span>
      </div>
    </div>
  </div>
);

const PurchaseFrequencyChart = () => (
  <div className="h-[300px] w-full mt-6">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={FREQUENCY_DATA} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
        <RechartsTooltip 
          cursor={{ fill: '#f8fafc' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl">
                  <p className="font-bold mb-1">{payload[0].payload.name}</p>
                  <p>{payload[0].value} clientes ({payload[0].payload.percent})</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {FREQUENCY_DATA.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === 0 ? '#0854ce' : '#60a5fa'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const getCohortColor = (value: number | null, isM0: boolean) => {
  if (value === null) return 'bg-gray-50';
  if (isM0) return 'bg-gray-100 font-bold';
  if (value >= 15) return 'bg-emerald-400 text-emerald-950 font-medium';
  if (value >= 10) return 'bg-emerald-300 text-emerald-900';
  if (value >= 5) return 'bg-emerald-200 text-emerald-800';
  if (value > 0) return 'bg-emerald-100 text-emerald-700';
  return 'bg-gray-50 text-gray-400';
};

const CohortTable = () => (
  <div className="overflow-x-auto mt-6">
    <table className="w-full text-sm text-center border-collapse">
      <thead>
        <tr>
          <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Cohort</th>
          {Array.from({ length: 13 }).map((_, i) => (
            <th key={i} className="py-3 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Mês {i}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {COHORT_DATA.map((row, i) => (
          <tr key={i} className="border-b border-gray-100 last:border-0">
            <td className="py-2 px-4 text-left font-medium text-gray-900">{row.cohort}</td>
            {row.values.map((val, j) => (
              <td key={j} className="p-1">
                <div className={`py-1.5 rounded-md text-xs ${getCohortColor(val, j === 0)}`}>
                  {val !== null ? `${val}%` : '-'}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RFMChangesTable = () => (
  <div className="overflow-x-auto mt-6">
    <table className="w-full text-sm text-center border-collapse">
      <thead>
        <tr>
          <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Mês Anterior →</th>
          {['Campeões', 'Clientes Fiéis', 'Potenciais Fiéis', 'Clientes Recentes', 'Promissores', 'Precisam De Atenção', 'Prestes A Dormir', 'Não Pode Perder', 'Em Risco', 'Hibernando', 'Perdidos'].map((col, i) => (
            <th key={i} className="py-3 px-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 leading-tight w-20">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {RFM_CHANGES_DATA.map((row, i) => (
          <tr key={i} className="border-b border-gray-100 last:border-0">
            <td className="py-3 px-4 text-left font-medium text-gray-900 text-xs">{row.name}</td>
            {row.values.map((val, j) => {
              let bgColor = '';
              if (val !== '-' && i === j) bgColor = 'bg-gray-50';
              else if (val !== '-' && j > i && j < i + 3) bgColor = 'bg-emerald-100 text-emerald-800 font-medium';
              else if (val !== '-' && j < i) bgColor = 'bg-red-50 text-red-800';

              return (
                <td key={j} className="p-1">
                  <div className={`py-2 rounded-md text-xs ${bgColor}`}>
                    {val}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Dashboard = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0854ce] to-blue-400 rounded-2xl p-8 text-white flex justify-between items-center mb-8 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold mb-2">HEY DAVI</h1>
          <p className="text-blue-100">Gosta de números? Nós também!</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-sm text-blue-100 font-medium">Não sabe por onde começar?</span>
          <button className="bg-white text-[#0854ce] px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-sm">
            Falar com um especialista
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Receita */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Receita influenciada pela Revi</h2>
            </div>
            <DateRangePicker />
          </div>
          <div className="flex gap-4">
            <MetricCard title="TOTAL" value="R$ 40.651" icon="R$" color="bg-[#0854ce]" />
            <MetricCard title="MARKETING" value="R$ 4.018" icon={<Megaphone size={16}/>} color="bg-blue-500" />
            <MetricCard title="AUTOMAÇÕES" value="R$ 36.633" icon={<Settings size={16}/>} color="bg-indigo-500" />
          </div>
        </div>

        {/* KPIs */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">KPIs</h2>
            <DateRangePicker />
          </div>
          <div className="flex gap-4">
            <MetricCard title="TICKET MÉDIO" value="R$ 216" icon="R$" color="bg-[#0854ce]" />
            <MetricCard title="LTV" value="R$ 351" icon="LTV" color="bg-[#0854ce]" />
            <MetricCard title="FREQUÊNCIA" value="1.7x" icon="Freq" color="bg-[#0854ce]" />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Nossas recomendações</h2>
        <p className="text-sm text-gray-500 mb-4">Recomendações personalizadas baseadas nos seus dados.</p>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {RECOMMENDATIONS.map(rec => (
            <RecommendationCard key={rec.id} {...rec} />
          ))}
        </div>
      </div>

      {/* RFM Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Sua matriz RFM</h2>
            <p className="text-sm text-gray-500">Entenda como seus clientes estão se comportando com base na matriz RFM.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Período máximo</span>
            <select className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#0854ce] focus:border-[#0854ce] block p-2.5 outline-none">
              <option>Último ano</option>
            </select>
            <button className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"><RefreshCw size={16} className="text-gray-600"/></button>
          </div>
        </div>
        <RFMMatrix />
      </div>

      {/* RFM Changes Table */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Mudanças na RFM com base nos meses anteriores</h2>
        <p className="text-sm text-gray-500">Acompanhe a evolução dos seus clientes entre os segmentos.</p>
        <RFMChangesTable />
      </div>

      {/* Purchase Frequency */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Frequência de compra</h2>
        <p className="text-sm text-gray-500">Distribuição de clientes pela quantidade de pedidos.</p>
        <PurchaseFrequencyChart />
      </div>

      {/* Cohort */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Análise de cohort de pedidos</h2>
        <p className="text-sm text-gray-500">Retenção de clientes ao longo do tempo.</p>
        <CohortTable />
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'calendar'>('home');
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'home' ? <Dashboard /> : <CalendarScreen />}
    </div>
  );
}
