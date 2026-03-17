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

// --- Tipos ---
type CampaignType = 'whatsapp' | 'email';
type CampaignStatus = 'scheduled' | 'executed';

interface CampaignEvent {
  id: string;
  day: number;
  type: CampaignType;
  status: CampaignStatus;
  title: string;
  time: string;
  dateStr: string;
  audienceSize: number;
  segment: string;
  previewText: string;
}

// --- Dados Mockados ---
const MOCK_EVENTS: CampaignEvent[] = [
  { id: '1', day: 3, type: 'whatsapp', status: 'executed', title: 'Promoção de Carnaval', time: '10:00', dateStr: '03 Fev', audienceSize: 12500, segment: 'Clientes VIP', previewText: '🎉 O Carnaval chegou mais cedo! Aproveite 30% OFF em toda a loja usando o cupom CARNA30. Clique aqui: https://link.revi/carna' },
  { id: '2', day: 3, type: 'email', status: 'executed', title: 'Newsletter Semanal', time: '14:30', dateStr: '03 Fev', audienceSize: 45000, segment: 'Base Geral', previewText: 'Confira as novidades da semana no nosso blog. Dicas de marketing, vendas e muito mais...' },
  { id: '3', day: 5, type: 'whatsapp', status: 'executed', title: 'Lembrete de Carrinho', time: '16:00', dateStr: '05 Fev', audienceSize: 340, segment: 'Abandono de Carrinho', previewText: 'Oi! Vimos que você deixou alguns itens no carrinho. Que tal finalizar sua compra agora com 10% de desconto? 🛒' },
  { id: '4', day: 10, type: 'email', status: 'executed', title: 'Lançamento Nova Coleção', time: '09:00', dateStr: '10 Fev', audienceSize: 50000, segment: 'Base Geral', previewText: 'A nova coleção Outono/Inverno já está disponível. Venha conferir as tendências que vão dominar a estação.' },
  { id: '5', day: 12, type: 'whatsapp', status: 'scheduled', title: 'Aviso de Manutenção', time: '11:15', dateStr: '12 Fev', audienceSize: 1500, segment: 'Usuários Ativos', previewText: '⚠️ Aviso importante: Nosso sistema passará por uma manutenção programada hoje às 23h. Previsão de retorno: 01h.' },
  { id: '6', day: 14, type: 'email', status: 'scheduled', title: 'Feliz Dia dos Namorados', time: '08:00', dateStr: '14 Fev', audienceSize: 45000, segment: 'Base Geral', previewText: 'Surpreenda quem você ama! Preparamos uma seleção especial de presentes para o Dia dos Namorados. ❤️' },
  { id: '7', day: 14, type: 'whatsapp', status: 'scheduled', title: 'Cupom Exclusivo', time: '10:00', dateStr: '14 Fev', audienceSize: 5000, segment: 'Leads Quentes', previewText: 'Presente especial para você! 🎁 Use o cupom AMOR20 e ganhe 20% de desconto na sua próxima compra.' },
  { id: '10', day: 14, type: 'email', status: 'scheduled', title: 'Dicas de Presente', time: '12:00', dateStr: '14 Fev', audienceSize: 20000, segment: 'Base Geral', previewText: 'Ainda não sabe o que comprar? Confira nossas dicas de presentes para todos os estilos.' },
  { id: '11', day: 14, type: 'whatsapp', status: 'scheduled', title: 'Última Chamada', time: '16:00', dateStr: '14 Fev', audienceSize: 10000, segment: 'Abandono de Carrinho', previewText: 'Últimas horas para garantir o presente perfeito! Finalize sua compra agora e receba a tempo.' },
  { id: '12', day: 14, type: 'email', status: 'scheduled', title: 'Jantar Romântico', time: '18:00', dateStr: '14 Fev', audienceSize: 5000, segment: 'Clientes VIP', previewText: 'Reserve sua mesa para um jantar inesquecível. Vagas limitadas!' },
  { id: '8', day: 20, type: 'email', status: 'scheduled', title: 'Pesquisa de Satisfação', time: '15:00', dateStr: '20 Fev', audienceSize: 10000, segment: 'Compradores Recentes', previewText: 'Sua opinião é muito importante para nós! Responda nossa pesquisa de satisfação e ganhe um brinde exclusivo.' },
  { id: '9', day: 25, type: 'whatsapp', status: 'scheduled', title: 'Oferta Relâmpago', time: '18:00', dateStr: '25 Fev', audienceSize: 20000, segment: 'Engajados 30 dias', previewText: '⚡ OFERTA RELÂMPAGO! Só nas próximas 2 horas: Compre 1 e Leve 2 em itens selecionados. Corra!' },
];

const DAYS_OF_WEEK = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

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

const EventCard: React.FC<{ event: CampaignEvent; onClick: () => void; isSelected: boolean }> = ({ event, onClick, isSelected }) => {
  const isWhatsApp = event.type === 'whatsapp';
  const isExecuted = event.status === 'executed';
  
  const headerBg = isWhatsApp ? 'bg-emerald-500' : 'bg-amber-400';
  const headerText = isWhatsApp ? 'text-white' : 'text-amber-950';
  const Icon = isWhatsApp ? MessageCircle : Mail;
  const typeName = isWhatsApp ? 'WhatsApp' : 'E-mail';
  const StatusIcon = isExecuted ? CheckCircle2 : CalendarIcon;

  return (
    <div className="relative group z-10 hover:z-30">
      {/* Card Principal */}
      <div 
        onClick={onClick}
        className={`flex flex-col bg-white border rounded-md shadow-sm mb-2 transition-all cursor-pointer overflow-hidden
          ${isSelected ? 'border-[#0854ce] ring-1 ring-[#0854ce] shadow-md' : 'border-gray-200 hover:shadow-md hover:border-[#0854ce]/40'}`}
      >
        {/* Header Colorido */}
        <div className={`${headerBg} ${headerText} px-2 py-1.5 flex items-center justify-between text-xs font-semibold`}>
          <div className="flex items-center gap-1.5">
            <Icon size={12} strokeWidth={3} />
            <span className="uppercase tracking-wide text-[10px]">{typeName}</span>
          </div>
        </div>
        
        {/* Corpo do Card */}
        <div className="p-2 flex flex-col gap-1">
          <h4 className="text-xs font-medium text-gray-900 leading-tight group-hover:text-[#0854ce] transition-colors line-clamp-2">
            {event.title}
          </h4>
          <div className={`flex items-center text-[10px] font-medium mt-1 ${isExecuted ? 'text-emerald-600' : 'text-gray-500'}`}>
            <StatusIcon size={10} className="mr-1" />
            {event.dateStr} • {event.time}
          </div>
        </div>
      </div>
    </div>
  );
};

const RightPanel: React.FC<{ selectedEvent: CampaignEvent | null; onClose: () => void }> = ({ selectedEvent, onClose }) => {
  if (selectedEvent) {
    const isWhatsApp = selectedEvent.type === 'whatsapp';
    const isExecuted = selectedEvent.status === 'executed';
    const Icon = isWhatsApp ? MessageCircle : Mail;
    const StatusIcon = isExecuted ? CheckCircle2 : CalendarIcon;

    return (
      <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col shrink-0 overflow-y-auto shadow-[-4px_0_15px_rgba(0,0,0,0.03)] z-20">
        {/* Header de Detalhes */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-gray-900">
            <X size={18} />
          </button>
          <h2 className="font-semibold text-gray-800">Detalhes do Agendamento</h2>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Status & Canal */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${isWhatsApp ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
              <Icon size={14} />
              {isWhatsApp ? 'WhatsApp' : 'E-mail'}
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${isExecuted ? 'text-emerald-600' : 'text-blue-600'}`}>
              <StatusIcon size={14} />
              {isExecuted ? 'Executada' : 'Programada'}
            </div>
          </div>

          {/* Título & Data */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{selectedEvent.title}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-2 font-medium">
              <CalendarIcon size={14} />
              {selectedEvent.dateStr} às {selectedEvent.time}
            </p>
          </div>

          {/* Audiência */}
          <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Público Alvo</h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Segmento / Lista</p>
                <p className="text-sm font-semibold text-gray-900">{selectedEvent.segment}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Tamanho da Audiência</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <Users size={14} className="text-[#0854ce]" />
                  {selectedEvent.audienceSize.toLocaleString('pt-BR')} contatos
                </p>
              </div>
            </div>
          </div>

          {/* Preview da Mensagem */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Preview da Mensagem</h4>
              <button className="text-[#0854ce] hover:text-blue-800 text-xs font-bold flex items-center gap-1 transition-colors">
                <Eye size={12} />
                Ver completo
              </button>
            </div>
            <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed relative group cursor-pointer hover:bg-gray-100 transition-colors">
              {selectedEvent.previewText}
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-[1px]">
                <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
                  Clique para visualizar
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // View Padrão (Estatísticas)
  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col shrink-0 z-20">
      {/* Seletor de Mês */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between bg-gray-50 rounded-full p-1 border border-gray-200">
          <button className="p-2 hover:bg-white rounded-full transition-colors"><ChevronLeft size={18} className="text-gray-600" /></button>
          <span className="font-semibold text-gray-800">Fevereiro 2026</span>
          <button className="p-2 hover:bg-white rounded-full transition-colors"><ChevronRight size={18} className="text-gray-600" /></button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-900">Estatísticas do Mês</h3>
          <Star size={16} className="text-gray-400" />
        </div>
        <p className="text-xs text-gray-500 mb-6">Resumo do seu planejamento</p>
        
        <div className="flex justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Eventos</p>
            <p className="text-2xl font-bold text-gray-900">1</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Campanhas</p>
            <p className="text-2xl font-bold text-gray-900">15</p>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="p-6 space-y-3 mt-auto mb-8">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Próximos 7 dias</p>
        <button className="w-full bg-black text-white font-semibold text-sm py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
          NOVA DATA MANUAL
        </button>
        <button className="w-full bg-white text-black border border-gray-300 font-semibold text-sm py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          NOVA CAMPANHA
        </button>
      </div>
    </div>
  );
};

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

const CalendarView = () => {
  const [selectedEvent, setSelectedEvent] = useState<CampaignEvent | null>(null);
  
  // Gerar dias do mês (simplificado para visualização)
  const daysInMonth = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex flex-col min-w-0">
        {/* Header Principal */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 text-[#0854ce] rounded-lg flex items-center justify-center">
              <LayoutDashboard size={18} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Calendário de Planejamento</h1>
          </div>
        </header>

        {/* Área de Conteúdo (Calendário + Painel Direito) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Grid do Calendário */}
          <div className="flex-1 flex flex-col overflow-hidden p-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
              
              {/* Cabeçalho dos Dias da Semana */}
              <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/50 shrink-0">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Células dos Dias */}
              <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-7 grid-rows-5 h-full">
                  {daysInMonth.map((day) => {
                    const dayEvents = MOCK_EVENTS.filter(e => e.day === day);
                    return (
                      <div key={day} className="border-r border-b border-gray-100 last:border-r-0 p-2 flex flex-col hover:bg-gray-50/50 transition-colors overflow-hidden">
                        <span className="text-sm font-medium text-gray-400 mb-2 ml-1 shrink-0">{day}</span>
                        <div className="flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden min-h-0 pr-1 custom-scrollbar">
                          {dayEvents.map(event => (
                            <EventCard 
                              key={event.id} 
                              event={event} 
                              isSelected={selectedEvent?.id === event.id}
                              onClick={() => setSelectedEvent(event)} 
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {/* Células vazias para completar o grid se necessário */}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={`empty-${i}`} className="border-r border-b border-gray-100 last:border-r-0 bg-gray-50/30"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <RightPanel 
            selectedEvent={selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
          />
        </div>
      </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'calendar'>('home');
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'home' ? <Dashboard /> : <CalendarView />}
    </div>
  );
}
