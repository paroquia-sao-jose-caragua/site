"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type {
  AppointmentService,
  AvailableSlot,
  PastoralAgent,
} from "@/entities/appointment";

interface BookingSummarySidebarProps {
  currentStep: number;
  selectedService: AppointmentService | null;
  selectedAgent: PastoralAgent | null;
  selectedDate: string;
  selectedSlot: AvailableSlot | null;
  selectedTopic: string;
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;
  patientName: string;
}

export function formatLongDatePtBr(dateStr: string): string {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function BookingSummarySidebar({
  currentStep,
  selectedService,
  selectedAgent,
  selectedDate,
  selectedSlot,
  selectedTopic,
  requesterName,
  requesterPhone,
  requesterEmail,
  patientName,
}: BookingSummarySidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const formattedDay = selectedDate ? formatLongDatePtBr(selectedDate) : "";
  const agentFullName = selectedAgent
    ? `${selectedAgent.title ? `${selectedAgent.title} ` : ""}${selectedAgent.name}`
    : null;

  const filledValueClass = "text-sm font-semibold text-[#18351E] mt-0.5 block";
  const emptyValueClass = "text-sm font-normal text-[#a39485] mt-0.5 block";

  const summaryRows = (
    <div className="space-y-4">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7b6c] block">
          Atendimento
        </span>
        <span className={selectedService ? filledValueClass : emptyValueClass}>
          {selectedService ? selectedService.title : "—"}
        </span>
      </div>

      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7b6c] block">
          Quem vai atender
        </span>
        <span className={agentFullName ? filledValueClass : emptyValueClass}>
          {agentFullName || "—"}
        </span>
      </div>

      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7b6c] block">
          Dia
        </span>
        <span
          className={`${formattedDay ? filledValueClass : emptyValueClass} capitalize`}
        >
          {formattedDay
            ? `${formattedDay}${selectedSlot ? ` às ${selectedSlot.startTime}` : ""}`
            : "—"}
        </span>
      </div>

      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7b6c] block">
          Observações
        </span>
        <span className={selectedTopic.trim() ? filledValueClass : emptyValueClass}>
          {selectedTopic.trim() || "—"}
        </span>
      </div>

      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7b6c] block">
          Fiel
        </span>
        <span className={requesterName.trim() ? filledValueClass : emptyValueClass}>
          {requesterName.trim() || "—"}
        </span>
      </div>

      {selectedService?.requiresAddress && patientName.trim() && (
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7b6c] block">
            Enfermo(a)
          </span>
          <span className="text-sm font-semibold text-[#18351E] mt-0.5 block">
            {patientName.trim()}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Compact Collapsible Summary (Steps 2, 3, 4) */}
      {currentStep > 1 && currentStep < 5 && (
        <div className="lg:hidden mb-6 rounded-2xl bg-[#fbf5eb] border border-[#D6A64A]/35 shadow-2xs overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer"
          >
            <div className="min-w-0 pr-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#a6824b] block">
                Seu agendamento
              </span>
              <p className="text-sm font-semibold text-[#18351E] truncate">
                {selectedService?.title}
                {selectedDate && selectedSlot
                  ? ` • ${selectedDate.split("-").reverse().slice(0, 2).join("/")} às ${selectedSlot.startTime}`
                  : ""}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#18351E] shrink-0">
              {mobileOpen ? "Ocultar" : "Detalhes"}
              {mobileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>

          {mobileOpen && (
            <div className="px-4 pb-4 pt-2 border-t border-[#D6A64A]/20">
              {summaryRows}
            </div>
          )}
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block lg:sticky lg:top-8 rounded-3xl bg-[#fbf5eb] border border-[#D6A64A]/30 p-6 shadow-xs">
        <h3
          className="text-xl font-semibold text-[#18351E] mb-5"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Seu agendamento
        </h3>
        {summaryRows}
      </aside>
    </>
  );
}
