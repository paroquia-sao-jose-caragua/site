"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  User,
  Phone,
  Search,
  Download,
  MessageCircle,
  ArrowLeft,
  X,
} from "lucide-react";
import {
  useTrackAppointment,
  useCancelAppointment,
} from "@/lib/api/appointments/use-appointments";
import { useParishContact } from "@/lib/api/parish-contact/use-parish-contact";
import { downloadAppointmentIcs } from "@/utils/calendar-ics";
import type { AppointmentStatus } from "@/entities/appointment";

function TrackAppointmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenParam = searchParams.get("token") || "";

  const [inputToken, setInputToken] = useState(tokenParam);
  const [activeToken, setActiveToken] = useState(tokenParam);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");

  const { contact } = useParishContact();

  const {
    data: appointment,
    isLoading,
    error,
    refetch,
  } = useTrackAppointment(activeToken);

  const cancelAppointmentMutation = useCancelAppointment();

  useEffect(() => {
    if (tokenParam) {
      setInputToken(tokenParam);
      setActiveToken(tokenParam);
    }
  }, [tokenParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken.trim()) return;
    setActiveToken(inputToken.trim());
    router.replace(`/agendamentos/acompanhar?token=${encodeURIComponent(inputToken.trim())}`);
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      setCancelError("Por favor, informe o motivo do cancelamento.");
      return;
    }
    setCancelError("");

    try {
      await cancelAppointmentMutation.mutateAsync({
        token: activeToken,
        reason: cancelReason.trim(),
      });
      setIsCancelModalOpen(false);
      setCancelReason("");
      refetch();
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "Erro ao cancelar o agendamento."
      );
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "pending":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock size={14} />
            <span>Pendente (Aguardando confirmação)</span>
          </div>
        );
      case "confirmed":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 size={14} />
            <span>Confirmado</span>
          </div>
        );
      case "completed":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <CheckCircle2 size={14} />
            <span>Realizado</span>
          </div>
        );
      case "cancelled":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle size={14} />
            <span>Cancelado</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Bar / Input Token */}
      <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-6 shadow-sm max-w-2xl">
        <label className="block text-xs font-bold text-[#a6824b] uppercase tracking-wider mb-2">
          Código de Acompanhamento
        </label>
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a6824b] w-4 h-4" />
            <input
              type="text"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Cole seu código (ex: 01j...)"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] text-[#18351E] outline-none focus:border-[#B8872E] text-sm font-mono font-medium"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18351E] px-6 py-3 text-sm font-semibold text-[#eeca94] hover:bg-[#27442A] transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            <Search size={15} />
            <span>Consultar</span>
          </button>
        </form>
      </div>

      {/* Appointment Details */}
      {isLoading ? (
        <div className="max-w-2xl h-64 rounded-2xl bg-[#fbf5eb] border border-[#D6A64A]/20 animate-pulse p-8" />
      ) : error ? (
        <div className="max-w-2xl bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 text-rose-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-base text-rose-900 mb-1">Agendamento não localizado</h4>
            <p className="text-xs leading-relaxed">
              Não encontramos nenhum atendimento com o código informado. Por favor, verifique se o código foi digitado corretamente ou entre em contato com a secretaria paroquial.
            </p>
          </div>
        </div>
      ) : appointment ? (
        <div className="max-w-2xl bg-[#fbf5eb] border border-[#D6A64A]/50 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
          {/* Top Status & Service */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D6A64A]/20 pb-4">
            <div>
              <span className="text-xs font-bold text-[#a6824b] uppercase tracking-wider block mb-1">
                {appointment.service?.category === "home_visit"
                  ? "Visita Pastoral a Domicílio"
                  : "Atendimento Presencial"}
              </span>
              <h3
                className="text-2xl font-bold text-[#18351E]"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {appointment.service?.title || "Atendimento Pastoral"}
              </h3>
            </div>

            {getStatusBadge(appointment.status)}
          </div>

          {/* Date, Time & Agent Details */}
          <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#fbf6ee] border border-[#D6A64A]/30">
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-5 h-5 text-[#B8872E] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-[#5A463B] block">Data e Horário</span>
                <span className="font-bold text-[#18351E] block text-sm">
                  {formatDateDisplay(appointment.appointmentDate)}
                </span>
                <span className="text-xs font-semibold text-[#18351E]">
                  {appointment.startTime} às {appointment.endTime}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-[#B8872E] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-[#5A463B] block">Clérigo / Agente</span>
                <span className="font-bold text-[#18351E] block text-sm">
                  {appointment.agent?.title ? `${appointment.agent.title} ` : ""}
                  {appointment.agent?.name}
                </span>
                <span className="text-xs text-[#5A463B]">
                  {appointment.agent?.actingRole}
                </span>
              </div>
            </div>
          </div>

          {/* Solicitante */}
          <div className="text-xs space-y-1.5 text-[#5A463B]">
            <span className="text-xs font-bold text-[#a6824b] uppercase tracking-wider block mb-1">
              Fiel / Solicitante
            </span>
            <p className="font-semibold text-[#18351E] text-sm">
              {appointment.requesterName} {appointment.requesterRelationship ? `(${appointment.requesterRelationship})` : ""}
            </p>
            <p>WhatsApp: {appointment.requesterPhone}</p>
            {appointment.requesterEmail && <p>E-mail: {appointment.requesterEmail}</p>}
          </div>

          {/* Se for Visita a Enfermo */}
          {appointment.patientName && (
            <div className="p-4 bg-[#fbf6ee] border border-[#D6A64A]/30 rounded-xl text-xs space-y-2 text-[#5A463B]">
              <span className="text-xs font-bold text-[#a6824b] uppercase tracking-wider block">
                Dados da Visita Domiciliar
              </span>
              <p className="font-semibold text-[#18351E] text-sm">
                Enfermo(a): {appointment.patientName}
              </p>

              {appointment.patientAddress && (
                <p className="flex items-start gap-1.5">
                  <MapPin size={14} className="text-[#B8872E] shrink-0 mt-0.5" />
                  <span>{appointment.patientAddress}</span>
                </p>
              )}

              {appointment.patientConditions && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {appointment.patientConditions.isBedridden && (
                    <span className="bg-white border border-[#D6A64A]/40 px-2 py-0.5 rounded text-[11px] font-medium text-[#18351E]">
                      Acamado
                    </span>
                  )}
                  {appointment.patientConditions.canSwallowHost && (
                    <span className="bg-white border border-[#D6A64A]/40 px-2 py-0.5 rounded text-[11px] font-medium text-[#18351E]">
                      Engole Hóstia
                    </span>
                  )}
                  {appointment.patientConditions.isLucid && (
                    <span className="bg-white border border-[#D6A64A]/40 px-2 py-0.5 rounded text-[11px] font-medium text-[#18351E]">
                      Lúcido
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Cancellation Notice */}
          {appointment.status === "cancelled" && appointment.cancellationReason && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              <span className="font-bold">Motivo do cancelamento:</span> {appointment.cancellationReason}
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-[#D6A64A]/20 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                downloadAppointmentIcs({
                  serviceTitle: appointment.service?.title || "Atendimento Pastoral",
                  agentName: `${appointment.agent?.title ? appointment.agent.title + " " : ""}${appointment.agent?.name}`,
                  date: appointment.appointmentDate,
                  startTime: appointment.startTime,
                  endTime: appointment.endTime,
                  address: appointment.patientAddress || "Paróquia São José",
                  description: appointment.requesterNotes,
                })
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D6A64A]/50 bg-[#fbf6ee] px-4 py-2.5 text-xs font-semibold text-[#18351E] hover:bg-[#ECD6BD]/40 transition-colors cursor-pointer"
            >
              <Download size={14} className="text-[#B8872E]" />
              <span>Baixar Calendário (.ics)</span>
            </button>

            <div className="flex items-center gap-2">
              <a
                href={
                  contact?.whatsappUrl ||
                  (contact?.whatsapp
                    ? `https://wa.me/55${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Olá! Gostaria de falar sobre meu agendamento (Código: ${appointment.accessToken}).`
                      )}`
                    : "https://wa.me/5512981705757")
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#18351E] px-4 py-2.5 text-xs font-semibold text-[#eeca94] hover:bg-[#27442A] transition-colors cursor-pointer"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </a>

              {appointment.status !== "cancelled" && appointment.status !== "completed" && (
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(true)}
                  className="rounded-xl border border-rose-300 text-rose-700 bg-rose-50/50 hover:bg-rose-100 px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar Agendamento
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Cancellation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#fbf5eb] border border-[#D6A64A]/60 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3
                className="text-2xl font-bold text-[#18351E]"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Cancelar Agendamento
              </h3>
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="text-[#8c7b6c] hover:text-[#18351E] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-[#5A463B] leading-relaxed">
              Você tem certeza que deseja cancelar este atendimento? O horário ficará disponível para outro paroquiano.
            </p>

            {cancelError && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800">
                {cancelError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#18351E] mb-1.5">
                Motivo do Cancelamento <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ex.: Imprevisto de trabalho, melhora do enfermo..."
                className="w-full rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-3.5 py-2.5 text-xs text-[#18351E] outline-none focus:border-[#B8872E] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="rounded-xl border border-[#D6A64A]/40 text-[#18351E] px-4 py-2 text-xs font-semibold hover:bg-[#ECD6BD]/40 cursor-pointer"
              >
                Voltar
              </button>

              <button
                type="button"
                disabled={cancelAppointmentMutation.isPending}
                onClick={handleConfirmCancel}
                className="rounded-xl bg-rose-700 text-white hover:bg-rose-800 px-5 py-2 text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-60"
              >
                {cancelAppointmentMutation.isPending ? "Cancelando..." : "Confirmar Cancelamento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackAppointmentPage() {
  return (
    <section className="relative overflow-hidden bg-[#fbf6ee] min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-36">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#8c7b6c] mb-6 flex items-center gap-2 font-medium">
          <Link href="/" className="hover:text-[#2d261e] transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <Link href="/agendamentos" className="hover:text-[#2d261e] transition-colors">
            Agendamentos
          </Link>
          <span>&gt;</span>
          <span className="text-[#2d261e]">Acompanhar</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a6824b] uppercase tracking-widest mb-2">
            <ShieldCheck size={14} />
            <span>PORTAL DO FIEL</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#18351E]">
            Acompanhar Agendamento
          </h1>
          <p className="text-sm md:text-base text-[#6b5c4d] mt-2 max-w-2xl">
            Consulte a confirmação do seu atendimento ou solicite cancelamento seguro caso tenha um imprevisto.
          </p>
        </div>

        <Suspense fallback={<div className="h-40 rounded-2xl bg-[#fbf5eb] animate-pulse max-w-2xl" />}>
          <TrackAppointmentContent />
        </Suspense>
      </div>

      {/* Decorative Wave Separator */}
      <div
        className="
        absolute
        bottom-[-2px]
        left-0
        w-[calc(100%+4cm)]
        max-w-none
        ml-[-2cm]
        aspect-[1536/296]
        bg-[url('/wave-separator.svg')]
        bg-no-repeat
        bg-center
        bg-cover
      "
      />
    </section>
  );
}
