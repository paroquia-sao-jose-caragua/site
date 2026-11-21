"use client";

import {
  ArrowLeft,
  CalendarClock,
  Check,
  Copy,
  Download,
  MessageCircle,
} from "lucide-react";
import type {
  Appointment,
  AppointmentService,
  PastoralAgent,
} from "@/entities/appointment";
import { downloadAppointmentIcs } from "@/utils/calendar-ics";

interface StepConfirmationProps {
  createdAppointment: Appointment;
  selectedService: AppointmentService | null;
  selectedAgent: PastoralAgent | null;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  trackingUrl: string;
  copiedLink: boolean;
  onCopyLink: () => void;
  whatsappSupportUrl: string;
  onReset: () => void;
}

export function StepConfirmation({
  createdAppointment,
  selectedService,
  selectedAgent,
  requesterPhone,
  copiedLink,
  onCopyLink,
  whatsappSupportUrl,
  onReset,
}: StepConfirmationProps) {
  const agentName = selectedAgent
    ? `${selectedAgent.title ? `${selectedAgent.title} ` : ""}${selectedAgent.name}`
    : "Equipe Pastoral";

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-[#FDFBF7] border border-[#D6A64A]/35 p-6 sm:p-10 shadow-xs text-center">
      <div className="size-12 rounded-xl bg-[#ECD6BD]/75 text-[#8c6218] flex items-center justify-center mx-auto mb-4">
        <CalendarClock size={24} strokeWidth={1.75} />
      </div>

      <h2
        className="text-2xl sm:text-4xl font-semibold text-[#18351E]"
        style={{ fontFamily: "Cormorant Garamond, serif" }}
      >
        Aguardando Confirmação
      </h2>

      <p className="text-md sm:text-base text-[#5A463B] max-w-lg mx-auto mt-3 leading-relaxed">
         Assim que o seu pedido for confirmado pela paróquia, avisaremos pelo WhatsApp informado{" "}
        {requesterPhone}.
      </p>

      {/* Ações finais */}
      <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={onCopyLink}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#18351E] text-[#eeca94] px-5 py-2.5 text-sm font-semibold hover:bg-[#27442A] transition-colors cursor-pointer"
        >
          {copiedLink ? <Check size={15} /> : <Copy size={15} />}
          <span>
            {copiedLink ? "Link copiado!" : "Copiar link de acompanhamento"}
          </span>
        </button>
        <button
          type="button"
          onClick={() =>
            downloadAppointmentIcs({
              serviceTitle: selectedService?.title || "Atendimento Pastoral",
              agentName,
              date: createdAppointment.appointmentDate,
              startTime: createdAppointment.startTime,
              endTime: createdAppointment.endTime,
              address:
                createdAppointment.patientAddress || "Paróquia São José",
              description: createdAppointment.requesterNotes,
            })
          }
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D6A64A]/50 bg-[#fbf6ee] px-5 py-2.5 text-sm font-semibold text-[#18351E] hover:bg-[#ECD6BD]/40 transition-colors cursor-pointer"
        >
          <Download size={15} className="text-[#B8872E]" />
          <span>Salvar lembrete no calendário</span>
        </button>
      </div>
      </div>

      <div className="flex flex-col items-center">
        <p
          className="text-base sm:text-lg italic text-[#8c5e2a] mt-5 mb-8 text-center"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          &ldquo;Vinde a mim, todos vós que estais cansados.&rdquo; — Mt 11,28
        </p>

        <button
          type="button"
          onClick={onReset}
          className="group inline-flex items-center gap-2 text-md font-semibold text-[#5A463B] hover:text-[#18351E] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft
            size={16}
            className="text-[#B8872E] group-hover:-translate-x-0.5 transition-transform"
          />
          <span>Fazer outra solicitação</span>
        </button>
      </div>
    </div>
  );
}
