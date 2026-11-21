"use client";

import { Clock, Info, MapPin, MessageCircle } from "lucide-react";
import type {
  AppointmentService,
  AvailableSlot,
  PastoralAgent,
} from "@/entities/appointment";
import { BookingCalendar } from "./BookingCalendar";
import { formatLongDatePtBr } from "./BookingSummarySidebar";

interface StepDateTimeSelectionProps {
  selectedService: AppointmentService;
  agents: PastoralAgent[];
  isLoadingAgents: boolean;
  selectedAgent: PastoralAgent | null;
  onSelectAgent: (agent: PastoralAgent) => void;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  availableSlots: AvailableSlot[];
  isLoadingSlots: boolean;
  selectedSlot: AvailableSlot | null;
  onSelectSlot: (slot: AvailableSlot) => void;
  parishWhatsappUrl: string;
  onBack: () => void;
}

export function StepDateTimeSelection({
  selectedService,
  agents,
  isLoadingAgents,
  selectedAgent,
  onSelectAgent,
  selectedDate,
  onSelectDate,
  availableSlots,
  isLoadingSlots,
  selectedSlot,
  onSelectSlot,
  parishWhatsappUrl,
  onBack,
}: StepDateTimeSelectionProps) {
  const agentNameDisplay = selectedAgent
    ? `${selectedAgent.title ? `${selectedAgent.title} ` : ""}${selectedAgent.name}`
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#18351E]"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Escolha o dia e o horário
        </h2>
        <p className="text-sm sm:text-base text-[#5A463B] mt-1.5">
          {agentNameDisplay
            ? `Dias em destaque têm horários com ${agentNameDisplay}.`
            : `Selecione quem irá atender e o melhor horário para ${selectedService.title}.`}
        </p>
      </div>

      {isLoadingAgents ? (
        <div className="h-64 rounded-3xl bg-white/80 border border-[#D6A64A]/20 animate-pulse" />
      ) : agents.length === 0 ? (
        <div className="bg-white/95 border border-[#D6A64A]/40 rounded-3xl p-8 text-center">
          <Info size={36} className="text-[#B8872E] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#18351E]">
            Nenhum agente pastoral com horários abertos
          </h3>
          <p className="text-sm text-[#5A463B] mt-1 max-w-md mx-auto">
            Para este serviço específico, os agendamentos estão sendo organizados diretamente pela equipe da secretaria paroquial.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
            <a
              href={parishWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#18351E] px-5 py-2.5 text-sm font-semibold text-[#f5ebd7] hover:bg-[#27442A] transition-all shadow-xs cursor-pointer"
            >
              <MessageCircle size={16} className="text-[#D6A64A]" />
              <span>Falar no WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-[#D6A64A]/50 text-[#18351E] px-5 py-2.5 text-sm font-semibold hover:bg-[#ECD6BD]/40 transition-colors cursor-pointer"
            >
              Escolher outro serviço
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Seletor de Agente (exibido quando há mais de 1 agente disponível) */}
          {agents.length > 1 && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8c7b6c] block">
                Quem irá lhe atender
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agents.map((agent) => {
                  const isSelected = selectedAgent?.id === agent.id;
                  return (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => onSelectAgent(agent)}
                      className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#18351E] text-[#eeca94] border-[#18351E] shadow-xs"
                          : "bg-white/95 border-[#D6A64A]/35 text-[#18351E] hover:border-[#B8872E]"
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-sm font-bold block truncate">
                          {agent.title ? `${agent.title} ` : ""}
                          {agent.name}
                        </span>
                        <span
                          className={`text-xs block truncate ${
                            isSelected ? "text-[#eeca94]/80" : "text-[#5A463B]"
                          }`}
                        >
                          {agent.actingRole}
                        </span>
                        {agent.community && (
                          <span
                            className={`text-[11px] flex items-center gap-1 mt-0.5 truncate ${
                              isSelected ? "text-[#eeca94]/70" : "text-[#8c7b6c]"
                            }`}
                          >
                            <MapPin size={10} />
                            {agent.community.name}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Faixa horizontal de dias + Grade de horários */}
          {selectedAgent && (
            <div className="space-y-5">
              <BookingCalendar
                agentId={selectedAgent.id}
                serviceId={selectedService.id}
                selectedDate={selectedDate}
                onSelectDate={onSelectDate}
              />

              <div className="rounded-3xl bg-white/95 border border-[#D6A64A]/30 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-semibold text-[#18351E] capitalize">
                    {selectedDate
                      ? `Horários para ${formatLongDatePtBr(selectedDate)}`
                      : "Selecione uma data"}
                  </h3>
                  <span className="text-xs text-[#8c7b6c] inline-flex items-center gap-1">
                    <Clock size={12} />
                    {selectedService.defaultDurationMinutes} min
                  </span>
                </div>

                {isLoadingSlots ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-11 rounded-full bg-[#fbf6ee] border border-[#D6A64A]/20 animate-pulse"
                      />
                    ))}
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="rounded-2xl bg-[#fbf6ee] border border-[#D6A64A]/25 p-5 text-center">
                    <Clock size={22} className="text-[#a6824b] mx-auto mb-1.5 opacity-70" />
                    <p className="text-sm font-semibold text-[#18351E]">
                      Sem horários disponíveis nesta data
                    </p>
                    <p className="text-xs text-[#5A463B] mt-0.5">
                      Escolha outro dia na faixa acima para ver os horários abertos.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {availableSlots.map((slot, idx) => {
                      const isSelected = selectedSlot?.startTime === slot.startTime;
                      return (
                        <button
                          key={`${slot.startTime}-${idx}`}
                          type="button"
                          onClick={() => onSelectSlot(slot)}
                          className={`rounded-full border py-2.5 px-4 text-sm font-semibold transition-all cursor-pointer text-center ${
                            isSelected
                              ? "bg-[#18351E] text-[#eeca94] border-[#18351E] shadow-xs"
                              : "bg-[#fbf6ee] border-[#D6A64A]/35 text-[#18351E] hover:border-[#B8872E] hover:bg-[#ECD6BD]/40"
                          }`}
                        >
                          {slot.startTime}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
