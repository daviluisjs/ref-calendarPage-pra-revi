import React, { useState } from 'react';
import { 
  MessageCircle, 
  Mail, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  LayoutDashboard,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  Users
} from 'lucide-react';

// --- Tipos ---
export type CampaignType = 'whatsapp' | 'email';
export type CampaignStatus = 'scheduled' | 'executed';

export interface CampaignEvent {
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
export const MOCK_EVENTS: CampaignEvent[] = [
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

export const DAYS_OF_WEEK = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

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

export const CalendarScreen = () => {
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
};

export default CalendarScreen;
