"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
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
import { formatLongDatePtBr } from "@/components/agendamentos/BookingSummarySidebar";
import type { AppointmentStatus } from "@/entities/appointment";

function getStatusPresentation(status: AppointmentStatus) {
  switch (status) {
    case "pending":
      return {
        icon: Clock,
        iconClass: "text-[#8c5e2a]",
        title: "Solicitação Aguardando Confirmação",
        description:
          "Seu pedido ainda está pendente de aprovação pela equipe paroquial. Assim que for confirmado, você receberá o aviso pelo WhatsApp.",
      };
    case "confirmed":
      return {
        icon: CheckCircle2,
        iconClass: "text-emerald-700",
        title: "Atendimento Confirmado",
        description:
          "Seu horário está confirmado! Caso tenha algum imprevisto e não possa comparecer, você pode cancelar abaixo para liberar a vaga.",
      };
    case "completed":
      return {
        icon: CheckCircle2,
        iconClass: "text-[#18351E]",
        title: "Atendimento Realizado",
        description:
          "Este atendimento já foi concluído. Que Deus continue abençoando você e sua família!",
      };
    case "cancelled":
      return {
        icon: XCircle,
        iconClass: "text-rose-700",
        title: "Agendamento Cancelado",
        description:
          "Este atendimento foi cancelado. Se desejar, você pode realizar uma nova solicitação a qualquer momento.",
      };
  }
}

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
    router.replace(
      `/agendamentos/acompanhar?token=${encodeURIComponent(inputToken.trim())}`
    );
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

  const agentFullName = appointment?.agent
    ? `${appointment.agent.title ? `${appointment.agent.title} ` : ""}${appointment.agent.name}`
    : "Equipe Pastoral";

  const whatsappUrl =
    contact?.whatsappUrl ||
    (contact?.whatsapp && appointment
      ? `https://wa.me/55${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
          `Olá! Gostaria de falar sobre meu agendamento (Código: ${appointment.accessToken}).`
        )}`
      : "https://wa.me/5512981705757");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Search Bar / Input Token */}
      <div className="rounded-3xl bg-[#FDFBF7] border border-[#D6A64A]/30 p-5 sm:p-6 shadow-2xs">
        <label className="block text-xs font-bold text-[#a6824b] uppercase tracking-wider mb-2">
          Código de Acompanhamento
        </label>
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Cole seu código (ex: 01j...)"
              className="w-full px-4 py-3 rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] text-[#18351E] placeholder:text-[#a39485] outline-none focus:border-[#B8872E] text-sm font-mono font-medium"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#18351E] px-7 py-3 text-sm font-semibold text-[#eeca94] hover:bg-[#27442A] transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Search size={15} />
            <span>Consultar</span>
          </button>
        </form>
      </div>

      {/* Appointment Details */}
      {isLoading ? (
        <div className="h-80 rounded-3xl bg-[#FDFBF7]/80 border border-[#D6A64A]/20 animate-pulse" />
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 text-rose-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-base text-rose-900 mb-1">
              Agendamento não localizado
            </h4>
            <p className="text-sm leading-relaxed">
              Não encontramos nenhum atendimento com o código informado. Por favor, verifique se o código foi digitado corretamente ou entre em contato com a secretaria paroquial.
            </p>
          </div>
        </div>
      ) : appointment ? (
        (() => {
          const statusInfo = getStatusPresentation(appointment.status);
          const StatusIcon = statusInfo.icon;

          return (
            <div className="rounded-3xl bg-[#FDFBF7] border border-[#D6A64A]/35 p-6 sm:p-10 shadow-xs text-center space-y-7">
              {/* Status Header */}
              <div>
                <div
                  className={`flex items-center justify-center mx-auto mb-3 ${statusInfo.iconClass}`}
                >
                  <StatusIcon size={44} strokeWidth={1.75} />
                </div>

                <h2
                  className="text-3xl sm:text-4xl font-semibold text-[#18351E]"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {statusInfo.title}
                </h2>

                <p className="text-sm sm:text-base text-[#5A463B] max-w-lg mx-auto mt-2.5 leading-relaxed">
                  {statusInfo.description}
                </p>

                {appointment.status === "cancelled" &&
                  appointment.cancellationReason && (
                    <div className="mt-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-800 text-left">
                      <span className="font-bold block mb-0.5">
                        Motivo do cancelamento
                      </span>
                      <span>{appointment.cancellationReason}</span>
                    </div>
                  )}
              </div>

              {/* Informações Preenchidas */}
              <div className="rounded-2xl bg-[#fbf6ee] border border-[#D6A64A]/30 p-5 sm:p-6 text-left space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7b6c] block">
                      Atendimento
                    </span>
                    <span className="text-sm font-semibold text-[#18351E] mt-0.5 block">
                      {appointment.service?.title || "Atendimento Pastoral"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7b6c] block">
                      Quem vai atender
                    </span>
                    <span className="text-sm font-semibold text-[#18351E] mt-0.5 block">
                      {agentFullName}
                    </span>
                    {appointment.agent?.actingRole && (
                      <span className="text-xs text-[#5A463B] block mt-0.5">
                        {appointment.agent.actingRole}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7b6c] block">
                      Data e horário
                    </span>
                    <span className="text-sm font-semibold text-[#18351E] mt-0.5 block capitalize">
                      {formatLongDatePtBr(appointment.appointmentDate)}
                    </span>
                    <span className="text-xs text-[#5A463B] block mt-0.5">
                      {appointment.startTime} às {appointment.endTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7b6c] block">
                      Solicitante
                    </span>
                    <span className="text-sm font-semibold text-[#18351E] mt-0.5 block">
                      {appointment.requesterName}
                      {appointment.requesterRelationship
                        ? ` (${appointment.requesterRelationship})`
                        : ""}
                    </span>
                    <span className="text-xs text-[#5A463B] block mt-0.5">
                      {appointment.requesterPhone}
                    </span>
                    {appointment.requesterEmail && (
                      <span className="text-xs text-[#5A463B] block break-all">
                        {appointment.requesterEmail}
                      </span>
                    )}
                  </div>
                </div>

                {appointment.requesterNotes && (
                  <div className="pt-4 border-t border-[#D6A64A]/20">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7b6c] block">
                      Observações informadas
                    </span>
                    <p className="text-sm text-[#18351E] mt-1 leading-relaxed">
                      {appointment.requesterNotes}
                    </p>
                  </div>
                )}

                {appointment.patientName && (
                  <div className="pt-4 border-t border-[#D6A64A]/20 space-y-2.5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c7b6c] block">
                        Enfermo(a) / Local da visita
                      </span>
                      <span className="text-sm font-semibold text-[#18351E] mt-0.5 block">
                        {appointment.patientName}
                      </span>
                    </div>

                    {appointment.patientAddress && (
                      <p className="text-xs sm:text-sm text-[#5A463B] flex items-start gap-1.5">
                        <MapPin
                          size={14}
                          className="text-[#B8872E] shrink-0 mt-0.5"
                        />
                        <span>{appointment.patientAddress}</span>
                      </p>
                    )}

                    {appointment.patientConditions && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {appointment.patientConditions.isBedridden && (
                          <span className="bg-[#fbf6ee] border border-[#D6A64A]/40 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[#18351E]">
                            Acamado
                          </span>
                        )}
                        {appointment.patientConditions.canSwallowHost && (
                          <span className="bg-[#fbf6ee] border border-[#D6A64A]/40 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[#18351E]">
                            Engole Hóstia
                          </span>
                        )}
                        {appointment.patientConditions.isLucid && (
                          <span className="bg-[#fbf6ee] border border-[#D6A64A]/40 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[#18351E]">
                            Lúcido
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 flex-wrap">
                {appointment.status !== "cancelled" && (
                  <button
                    type="button"
                    onClick={() =>
                      downloadAppointmentIcs({
                        serviceTitle:
                          appointment.service?.title || "Atendimento Pastoral",
                        agentName: agentFullName,
                        date: appointment.appointmentDate,
                        startTime: appointment.startTime,
                        endTime: appointment.endTime,
                        address:
                          appointment.patientAddress || "Paróquia São José",
                        description: appointment.requesterNotes,
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D6A64A]/50 bg-[#fbf6ee] px-5 py-2.5 text-sm font-semibold text-[#18351E] hover:bg-[#ECD6BD]/40 transition-colors cursor-pointer"
                  >
                    <Download size={15} className="text-[#B8872E]" />
                    <span>Salvar no calendário</span>
                  </button>
                )}

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D6A64A]/50 bg-[#fbf6ee] px-5 py-2.5 text-sm font-semibold text-[#18351E] hover:bg-[#ECD6BD]/40 transition-colors cursor-pointer"
                >
                  <MessageCircle size={15} className="text-[#B8872E]" />
                  <span>WhatsApp da Secretaria</span>
                </a>

                {appointment.status !== "cancelled" &&
                  appointment.status !== "completed" && (
                    <button
                      type="button"
                      onClick={() => setIsCancelModalOpen(true)}
                      className="inline-flex items-center justify-center rounded-full border border-rose-300 text-rose-700 bg-rose-50/60 hover:bg-rose-100 px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Cancelar agendamento
                    </button>
                  )}
              </div>
            </div>
          );
        })()
      ) : null}

      {/* Cancellation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FBF8F3] border border-[#D6A64A]/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3
                className="text-2xl font-bold text-[#18351E]"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Cancelar Agendamento
              </h3>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="text-[#8c7b6c] hover:text-[#18351E] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-[#5A463B] leading-relaxed">
              Você tem certeza que deseja cancelar este atendimento? O horário ficará disponível para outro paroquiano.
            </p>

            {cancelError && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-sm text-rose-800">
                {cancelError}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#18351E] mb-1.5">
                Motivo do Cancelamento <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ex.: Imprevisto de trabalho, melhora do enfermo..."
                className="w-full rounded-2xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-3.5 py-2.5 text-sm text-[#18351E] outline-none focus:border-[#B8872E] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="rounded-full border border-[#D6A64A]/50 text-[#18351E] px-5 py-2 text-sm font-semibold hover:bg-[#ECD6BD]/40 cursor-pointer"
              >
                Voltar
              </button>

              <button
                type="button"
                disabled={cancelAppointmentMutation.isPending}
                onClick={handleConfirmCancel}
                className="rounded-full bg-rose-700 text-white hover:bg-rose-800 px-5 py-2 text-sm font-semibold cursor-pointer shadow-xs disabled:opacity-60"
              >
                {cancelAppointmentMutation.isPending
                  ? "Cancelando..."
                  : "Confirmar cancelamento"}
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-36">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#8c7b6c] mb-6 flex items-center gap-2 font-medium">
          <Link href="/" className="hover:text-[#2d261e] transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <Link
            href="/agendamentos"
            className="hover:text-[#2d261e] transition-colors"
          >
            Agendamentos
          </Link>
          <span>&gt;</span>
          <span className="text-[#2d261e]">Acompanhar</span>
        </nav>

        {/* Page Header */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#18351E]">
              Acompanhar Agendamento
            </h1>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="max-w-2xl mx-auto h-40 rounded-3xl bg-[#FDFBF7]/80 animate-pulse" />
          }
        >
          <TrackAppointmentContent />
        </Suspense>

        <div className="flex items-center justify-center mt-12">
          <Link
            href="/agendamentos"
            className="inline-flex items-center gap-2 rounded-full border border-[#D6A64A]/50 bg-[#FDFBF7] px-4 py-2 text-xs sm:text-sm font-semibold text-[#18351E] hover:bg-[#ECD6BD]/40 hover:border-[#B8872E] transition-colors shadow-2xs self-start sm:self-auto"
          >
            <ArrowLeft size={15} className="text-[#B8872E]" />
            <span>Fazer novo agendamento</span>
          </Link>
        </div>
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
