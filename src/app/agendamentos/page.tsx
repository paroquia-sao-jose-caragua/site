"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  Heart,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Download,
  MessageCircle,
  Sparkles,
  Info,
} from "lucide-react";
import {
  useAppointmentServices,
  usePastoralAgents,
  useAvailableSlots,
  useCreateAppointment,
  useAppointmentSettings,
} from "@/lib/api/appointments/use-appointments";
import type {
  AppointmentService,
  PastoralAgent,
  AvailableSlot,
  Appointment,
} from "@/entities/appointment";
import { useCommunities } from "@/lib/api/communities/use-communities";
import { useParishContact } from "@/lib/api/parish-contact/use-parish-contact";
import { downloadAppointmentIcs } from "@/utils/calendar-ics";

function getServiceVisuals(service: AppointmentService) {
  const titleLower = service.title.toLowerCase();
  if (titleLower.includes("confissão")) {
    return {
      categoryTag: "Sacramento da Penitência",
      tagClass: "bg-purple-100/90 text-purple-900 border-purple-300 font-bold",
      cardBorder: "border-purple-300/80 hover:border-purple-600 hover:ring-2 hover:ring-purple-500/20",
      highlightBadge: "Exclusivo Sacerdote",
      highlightClass: "bg-purple-50 text-purple-800 border-purple-200",
    };
  }
  if (titleLower.includes("aconselhamento")) {
    return {
      categoryTag: "Escuta & Orientação Pastoral",
      tagClass: "bg-sky-100/90 text-sky-900 border-sky-300 font-semibold",
      cardBorder: "border-sky-300/80 hover:border-sky-600 hover:ring-2 hover:ring-sky-500/20",
      highlightBadge: "Atendimento Geral",
      highlightClass: "bg-sky-50 text-sky-800 border-sky-200",
    };
  }
  if (titleLower.includes("direção")) {
    return {
      categoryTag: "Acompanhamento Espiritual",
      tagClass: "bg-indigo-100/90 text-indigo-900 border-indigo-300 font-semibold",
      cardBorder: "border-indigo-300/80 hover:border-indigo-600 hover:ring-2 hover:ring-indigo-500/20",
      highlightBadge: "Discernimento Vocacional",
      highlightClass: "bg-indigo-50 text-indigo-800 border-indigo-200",
    };
  }
  if (service.requiresAddress) {
    return {
      categoryTag: "Visita Domiciliar",
      tagClass: "bg-amber-100/90 text-amber-900 border-amber-300 font-semibold",
      cardBorder: "border-amber-300/80 hover:border-amber-600 hover:ring-2 hover:ring-amber-500/20",
      highlightBadge: "Enfermos e Idosos",
      highlightClass: "bg-amber-50 text-amber-800 border-amber-200",
    };
  }
  return {
    categoryTag: "Atendimento Presencial",
    tagClass: "bg-emerald-100/90 text-emerald-900 border-emerald-300 font-semibold",
    cardBorder: "border-[#D6A64A]/40 hover:border-[#B8872E] hover:ring-2 hover:ring-[#D6A64A]/20",
    highlightBadge: "Presencial",
    highlightClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
  };
}

export default function AgendamentosPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<AppointmentService | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<PastoralAgent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  // Requester form
  const [requesterName, setRequesterName] = useState("");
  const [requesterPhone, setRequesterPhone] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterRelationship, setRequesterRelationship] = useState("");
  const [communityId, setCommunityId] = useState<string>("");
  const [requesterNotes, setRequesterNotes] = useState("");

  // Patient / Home visit form
  const [patientName, setPatientName] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [complement, setComplement] = useState("");
  const [referencePoint, setReferencePoint] = useState("");
  const [isBedridden, setIsBedridden] = useState(false);
  const [canSwallowHost, setCanSwallowHost] = useState(true);
  const [isLucid, setIsLucid] = useState(true);
  const [patientNotes, setPatientNotes] = useState("");

  // Submission state
  const [formError, setFormError] = useState("");
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Queries
  const { data: settings, isLoading: isLoadingSettings } = useAppointmentSettings();
  const { data: services = [], isLoading: isLoadingServices } = useAppointmentServices();
  const { data: agents = [], isLoading: isLoadingAgents } = usePastoralAgents(
    selectedService?.id
  );
  const { data: availableSlots = [], isLoading: isLoadingSlots } = useAvailableSlots(
    selectedAgent?.id,
    selectedDate,
    selectedService?.id
  );
  const { communities = [] } = useCommunities();
  const { contact } = useParishContact();
  const createAppointmentMutation = useCreateAppointment();

  // Format Phone Mask: (12) 98888-8888
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 11);
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    if (raw.length > 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    }
    setRequesterPhone(formatted);
  };

  // Format CEP Mask & fetch ViaCEP
  const handleCepChange = async (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 8);
    let formatted = raw;
    if (raw.length > 5) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    }
    setCep(formatted);

    if (raw.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        const data = (await res.json()) as {
          erro?: boolean;
          logradouro?: string;
          bairro?: string;
        };
        if (!data.erro) {
          if (data.logradouro) setStreet(data.logradouro);
          if (data.bairro) setNeighborhood(data.bairro);
        }
      } catch {
        // silent fallback
      }
    }
  };

  // Generate date options (next 14 days, skipping Sundays or days when church is closed)
  const generateUpcomingDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 1; i <= 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      // We support Tue-Sat (days 2 to 6)
      const dayOfWeek = d.getDay();
      if (dayOfWeek >= 2 && dayOfWeek <= 6) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${day}`;

        const dayName = new Intl.DateTimeFormat("pt-BR", {
          weekday: "short",
        }).format(d);
        const monthName = new Intl.DateTimeFormat("pt-BR", {
          month: "short",
        }).format(d);

        days.push({
          dateStr,
          dayNumber: day,
          dayName: dayName.replace(".", "").toUpperCase(),
          monthName: monthName.replace(".", ""),
        });
      }
      if (days.length >= 10) break;
    }
    return days;
  };

  const upcomingDays = generateUpcomingDays();

  // Advance to Step 2
  const handleSelectService = (service: AppointmentService) => {
    setSelectedService(service);
    setSelectedAgent(null);
    setSelectedSlot(null);
    setCurrentStep(2);
  };

  // Advance to Step 3
  const handleSelectAgent = (agent: PastoralAgent) => {
    setSelectedAgent(agent);
    setSelectedSlot(null);
    if (!selectedDate && upcomingDays.length > 0) {
      setSelectedDate(upcomingDays[0].dateStr);
    }
    setCurrentStep(3);
  };

  // Advance to Step 4
  const handleSelectSlot = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setCurrentStep(4);
  };

  // Advance to Step 5 (Review)
  const handleReviewStep = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!requesterName.trim()) {
      setFormError("Por favor, preencha o seu nome completo.");
      return;
    }
    if (!requesterPhone.trim() || requesterPhone.replace(/\D/g, "").length < 10) {
      setFormError("Por favor, informe um WhatsApp válido com DDD.");
      return;
    }

    if (selectedService?.requiresAddress) {
      if (!patientName.trim()) {
        setFormError("Por favor, informe o nome do enfermo ou idoso acamado.");
        return;
      }
      if (!street.trim() || !number.trim() || !neighborhood.trim()) {
        setFormError("Por favor, informe o endereço completo (Rua, Número e Bairro).");
        return;
      }
    }

    setCurrentStep(5);
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    if (!selectedService || !selectedAgent || !selectedDate || !selectedSlot) {
      setFormError("Dados do agendamento incompletos. Por favor, revise os passos anteriores.");
      return;
    }

    setFormError("");

    let fullAddress: string | undefined = undefined;
    if (selectedService.requiresAddress) {
      const parts = [
        `${street}, ${number}`,
        complement ? `(${complement})` : null,
        neighborhood,
        cep ? `CEP: ${cep}` : null,
        referencePoint ? `Ref: ${referencePoint}` : null,
      ].filter(Boolean);
      fullAddress = parts.join(" — ");
    }

    try {
      const result = await createAppointmentMutation.mutateAsync({
        serviceId: selectedService.id,
        agentId: selectedAgent.id,
        communityId: communityId || selectedSlot.communityId || undefined,
        appointmentDate: selectedDate,
        startTime: selectedSlot.startTime,
        requesterName: requesterName.trim(),
        requesterPhone: requesterPhone.trim(),
        requesterEmail: requesterEmail.trim() || undefined,
        requesterRelationship: requesterRelationship.trim() || undefined,
        patientName: patientName.trim() || undefined,
        patientAddress: fullAddress,
        patientConditions: selectedService.requiresAddress
          ? {
              isBedridden,
              canSwallowHost,
              isLucid,
              notes: patientNotes.trim() || undefined,
            }
          : undefined,
        requesterNotes: requesterNotes.trim() || undefined,
      });

      setCreatedAppointment(result);
      setCurrentStep(6); // Success Step
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Não foi possível concluir o agendamento. Tente novamente."
      );
    }
  };

  const trackingUrl = createdAppointment
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/agendamentos/acompanhar?token=${createdAppointment.accessToken}`
    : "";

  const handleCopyToken = () => {
    if (!createdAppointment) return;
    navigator.clipboard.writeText(createdAppointment.accessToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const handleCopyLink = () => {
    if (!trackingUrl) return;
    navigator.clipboard.writeText(trackingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <section className="relative overflow-hidden bg-[#fbf6ee] min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-36">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#8c7b6c] mb-6 flex items-center gap-2 font-medium">
          <Link href="/" className="hover:text-[#2d261e] transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <span className="text-[#2d261e]">Agendamentos</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a6824b] uppercase tracking-widest mb-2">
              <CalendarIcon size={14} />
              <span>ATENDIMENTO E VISITAS PASTORAIS</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#18351E]">
              Agendamentos Pastorais
            </h1>
            <p className="text-sm md:text-base text-[#6b5c4d] mt-2 max-w-2xl">
              Agende atendimento sacramental com nossos sacerdotes ou solicite a visita da Sagrada Comunhão para enfermos e idosos.
            </p>
          </div>

          {/* Quick link to tracking */}
          <Link
            href="/agendamentos/acompanhar"
            className="inline-flex items-center gap-2 rounded-xl border border-[#D6A64A]/50 bg-[#fbf5eb] px-4 py-2.5 text-sm font-semibold text-[#18351E] hover:bg-[#ECD6BD]/40 hover:border-[#B8872E] transition-colors shadow-2xs self-start md:self-auto"
          >
            <ShieldCheck size={16} className="text-[#B8872E]" />
            <span>Já agendou? Acompanhe aqui</span>
          </Link>
        </div>

        {/* Loading Settings Skeleton */}
        {isLoadingSettings ? (
          <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
            <div className="size-10 border-2 border-[#D6A64A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#8c7b6c]">Verificando disponibilidade de agendamentos...</p>
          </div>
        ) : settings && !settings.enabled ? (
          <div className="max-w-3xl mx-auto mt-6 bg-white/95 backdrop-blur-xs rounded-3xl border border-[#D6A64A]/40 p-8 md:p-12 shadow-xl shadow-[#D6A64A]/5 text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#D6A64A] to-transparent" />

            <div className="size-16 md:size-20 mx-auto rounded-2xl bg-[#ECD6BD]/30 border border-[#D6A64A]/40 flex items-center justify-center text-[#B8872E] mb-6 shadow-inner">
              <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-[#B8872E]" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbf5eb] border border-[#D6A64A]/40 text-xs font-bold text-[#A67C1E] uppercase tracking-wider mb-4">
              <span>Comunicado Paroquial</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#18351E] mb-4">
              {settings.suspendedTitle || "Agendamentos Temporariamente Suspensos"}
            </h2>

            <p className="text-sm md:text-base text-[#5A463B] leading-relaxed max-w-xl mx-auto mb-8 whitespace-pre-line">
              {settings.suspendedMessage ||
                "Os agendamentos online estão temporariamente suspensos. Para urgências sacramentais ou informações, favor entrar em contato diretamente com a secretaria paroquial."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-6 border-t border-[#ECD6BD]/60">
              {contact?.whatsappUrl ? (
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#18351E] px-5 py-3 text-sm font-semibold text-[#f5ebd7] hover:bg-[#122816] transition-all shadow-md"
                >
                  <MessageCircle size={16} className="text-[#D6A64A]" />
                  <span>Falar com a Secretaria no WhatsApp</span>
                </a>
              ) : contact?.phone ? (
                <a
                  href={`tel:${contact.phone.replace(/\D/g, "")}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#18351E] px-5 py-3 text-sm font-semibold text-[#f5ebd7] hover:bg-[#122816] transition-all shadow-md"
                >
                  <Phone size={16} className="text-[#D6A64A]" />
                  <span>Ligar para a Secretaria: {contact.phone}</span>
                </a>
              ) : null}

              <Link
                href="/agendamentos/acompanhar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#D6A64A]/50 bg-[#fbf5eb] px-5 py-3 text-sm font-semibold text-[#18351E] hover:bg-[#ECD6BD]/40 transition-colors"
              >
                <ShieldCheck size={16} className="text-[#B8872E]" />
                <span>Consultar agendamento existente</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Multi-step Progress Bar (Steps 1 to 5) */}
        {currentStep < 6 && (
          <div className="mb-10">
            <div className="grid grid-cols-5 gap-2 md:gap-4 max-w-3xl">
              {[
                { step: 1, label: "Serviço" },
                { step: 2, label: "Agente" },
                { step: 3, label: "Horário" },
                { step: 4, label: "Dados" },
                { step: 5, label: "Confirmação" },
              ].map((item) => {
                const isActive = currentStep === item.step;
                const isPassed = currentStep > item.step;

                return (
                  <button
                    key={item.step}
                    disabled={!isPassed}
                    onClick={() => isPassed && setCurrentStep(item.step)}
                    className={`flex flex-col items-center text-center group transition-all ${
                      isPassed ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div
                      className={`size-8 md:size-9 rounded-full flex items-center justify-center font-bold text-xs md:text-sm mb-1.5 transition-all ${
                        isActive
                          ? "bg-[#18351E] text-[#eeca94] ring-2 ring-[#B8872E] ring-offset-2 ring-offset-[#fbf6ee]"
                          : isPassed
                          ? "bg-[#D6A64A] text-white"
                          : "bg-[#e8dfd1] text-[#8c7b6c]"
                      }`}
                    >
                      {isPassed ? <Check size={14} /> : item.step}
                    </div>
                    <span
                      className={`text-[11px] md:text-xs font-semibold ${
                        isActive
                          ? "text-[#18351E]"
                          : isPassed
                          ? "text-[#5A463B]"
                          : "text-[#a39485]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: Seleção de Serviço */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-[#D6A64A]/30 pb-3">
              <h2
                className="text-2xl md:text-3xl font-semibold text-[#18351E]"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                1. Escolha o tipo de atendimento
              </h2>
              <p className="text-sm text-[#5A463B] mt-1">
                Selecione o serviço que melhor atende à sua necessidade espiritual ou de sua família.
              </p>
            </div>

            {isLoadingServices ? (
              <div className="grid md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-36 rounded-2xl bg-[#fbf5eb] border border-[#D6A64A]/20 animate-pulse p-6"
                  />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {services.map((service) => {
                  const visuals = getServiceVisuals(service);

                  return (
                    <div
                      key={service.id}
                      onClick={() => handleSelectService(service)}
                      className={`group bg-[#fbf5eb] border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${visuals.cardBorder}`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${visuals.tagClass}`}
                            >
                              {visuals.categoryTag}
                            </span>
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${visuals.highlightClass}`}
                            >
                              {visuals.highlightBadge}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-[#8c7b6c] flex items-center gap-1 shrink-0">
                            <Clock size={12} />
                            {service.defaultDurationMinutes} min
                          </span>
                        </div>

                        <h3
                          className="text-xl font-bold text-[#18351E] group-hover:text-[#B8872E] transition-colors mt-2"
                          style={{ fontFamily: "Cormorant Garamond, serif" }}
                        >
                          {service.title}
                        </h3>

                        {service.description && (
                          <p className="text-sm text-[#5A463B] mt-2 leading-relaxed">
                            {service.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 pt-4 border-t border-[#D6A64A]/20 flex items-center justify-between text-sm font-semibold text-[#18351E] group-hover:text-[#B8872E]">
                        <span>Prosseguir com este atendimento</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Seleção de Agente */}
        {currentStep === 2 && selectedService && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#D6A64A]/30 pb-3">
              <div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1 text-xs text-[#8c7b6c] hover:text-[#18351E] font-medium mb-1 cursor-pointer"
                >
                  <ChevronLeft size={14} /> Voltar aos serviços
                </button>
                <h2
                  className="text-2xl md:text-3xl font-semibold text-[#18351E]"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  2. Escolha quem irá lhe atender
                </h2>
                <p className="text-sm text-[#5A463B] mt-1">
                  Atendimento para: <span className="font-semibold text-[#18351E]">{selectedService.title}</span>
                </p>
              </div>
            </div>

            {isLoadingAgents ? (
              <div className="grid md:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-40 rounded-2xl bg-[#fbf5eb] border border-[#D6A64A]/20 animate-pulse p-6"
                  />
                ))}
              </div>
            ) : agents.length === 0 ? (
              <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-8 text-center">
                <Info size={36} className="text-[#B8872E] mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-[#18351E]">Nenhum agente pastoral disponível</h3>
                <p className="text-sm text-[#5A463B] mt-1 max-w-md mx-auto">
                  No momento não há agentes com horários configurados para este serviço. Por favor, entre em contato direto com a Secretaria Paroquial.
                </p>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="mt-5 rounded-xl border border-[#D6A64A] text-[#18351E] px-6 py-2 text-sm font-semibold hover:bg-[#f3ece0]"
                >
                  Escolher outro serviço
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-5">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => handleSelectAgent(agent)}
                    className="group bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-6 shadow-sm hover:border-[#B8872E] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="size-16 rounded-full bg-[#18351E] text-[#eeca94] flex items-center justify-center font-serif text-2xl font-bold mb-4 overflow-hidden border-2 border-[#D6A64A]">
                        {agent.photoUrl ? (
                          <img
                            src={agent.photoUrl}
                            alt={agent.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          agent.title || agent.name.charAt(0)
                        )}
                      </div>

                      <span className="text-xs font-bold text-[#a6824b] uppercase tracking-wider block mb-1">
                        {agent.actingRole}
                      </span>

                      <h3
                        className="text-xl font-bold text-[#18351E] group-hover:text-[#B8872E] transition-colors"
                        style={{ fontFamily: "Cormorant Garamond, serif" }}
                      >
                        {agent.title ? `${agent.title} ` : ""}
                        {agent.name}
                      </h3>

                      {agent.community && (
                        <p className="text-xs text-[#5A463B] mt-1 flex items-center gap-1">
                          <MapPin size={12} className="text-[#B8872E]" />
                          {agent.community.name}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#D6A64A]/20 flex items-center justify-between text-sm font-semibold text-[#18351E] group-hover:text-[#B8872E]">
                      <span>Ver horários</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Data e Horário */}
        {currentStep === 3 && selectedService && selectedAgent && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#D6A64A]/30 pb-3">
              <div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1 text-xs text-[#8c7b6c] hover:text-[#18351E] font-medium mb-1 cursor-pointer"
                >
                  <ChevronLeft size={14} /> Trocar agente
                </button>
                <h2
                  className="text-2xl md:text-3xl font-semibold text-[#18351E]"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  3. Selecione o dia e o horário
                </h2>
                <p className="text-sm text-[#5A463B] mt-1">
                  Atendimento com: <span className="font-semibold text-[#18351E]">{selectedAgent.title} {selectedAgent.name}</span>
                </p>
              </div>
            </div>

            {/* Date Selector Carousel / Grid */}
            <div>
              <label className="block text-xs font-bold text-[#a6824b] uppercase tracking-wider mb-2">
                Escolha a data
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2.5">
                {upcomingDays.map((day) => {
                  const isSelected = selectedDate === day.dateStr;

                  return (
                    <button
                      key={day.dateStr}
                      type="button"
                      onClick={() => {
                        setSelectedDate(day.dateStr);
                        setSelectedSlot(null);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? "bg-[#18351E] text-[#eeca94] border-[#18351E] shadow-sm"
                          : "bg-[#fbf5eb] border-[#D6A64A]/40 text-[#18351E] hover:border-[#B8872E] hover:bg-[#f3ece0]"
                      }`}
                    >
                      <span className="text-[10px] font-semibold opacity-75 block uppercase">
                        {day.dayName}
                      </span>
                      <span className="text-xl font-bold my-0.5" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                        {day.dayNumber}
                      </span>
                      <span className="text-[10px] uppercase font-medium">
                        {day.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-6 lg:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-xl font-bold text-[#18351E]"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Horários disponíveis para {formatDateDisplay(selectedDate)}
                </h3>
                <span className="text-xs text-[#8c7b6c] flex items-center gap-1">
                  <Clock size={13} /> {selectedService.defaultDurationMinutes} min por atendimento
                </span>
              </div>

              {isLoadingSlots ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-12 rounded-xl bg-[#f0e7d8] animate-pulse" />
                  ))}
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock size={32} className="text-[#a6824b] mx-auto mb-2 opacity-60" />
                  <p className="text-base font-semibold text-[#18351E]">
                    Não há horários disponíveis para esta data.
                  </p>
                  <p className="text-xs text-[#5A463B] mt-1">
                    Por favor, selecione outro dia acima para ver as vagas abertas.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {availableSlots.map((slot, idx) => {
                    const isSelected = selectedSlot?.startTime === slot.startTime;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSlot(slot)}
                        className={`py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? "bg-[#18351E] text-[#eeca94] border-[#18351E] shadow-sm"
                            : "bg-[#fbf6ee] border-[#D6A64A]/40 text-[#18351E] hover:border-[#B8872E] hover:bg-[#ECD6BD]/40"
                        }`}
                      >
                        <span className="text-base font-bold">{slot.startTime}</span>
                        <span className="text-[10px] text-[#5A463B]">até {slot.endTime}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Formulário de Dados */}
        {currentStep === 4 && selectedService && selectedAgent && selectedSlot && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between border-b border-[#D6A64A]/30 pb-3">
              <div>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-1 text-xs text-[#8c7b6c] hover:text-[#18351E] font-medium mb-1 cursor-pointer"
                >
                  <ChevronLeft size={14} /> Trocar horário
                </button>
                <h2
                  className="text-2xl md:text-3xl font-semibold text-[#18351E]"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  4. Informe seus dados
                </h2>
                <p className="text-sm text-[#5A463B] mt-1">
                  Dia <span className="font-semibold text-[#18351E]">{formatDateDisplay(selectedDate)}</span> às{" "}
                  <span className="font-semibold text-[#18351E]">{selectedSlot.startTime}</span> com{" "}
                  <span className="font-semibold text-[#18351E]">{selectedAgent.title} {selectedAgent.name}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleReviewStep} className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
              {formError && (
                <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 flex items-center gap-2">
                  <AlertCircle size={18} className="shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Se for Presencial: Dados do Fiel */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#a6824b] uppercase tracking-wider">
                  {selectedService.requiresAddress ? "Dados de Quem Solicita a Visita" : "Dados do Fiel"}
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#18351E] mb-1.5">
                      Nome Completo <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={requesterName}
                      onChange={(e) => setRequesterName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="w-full rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-4 py-3 text-[#18351E] outline-none focus:border-[#B8872E] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#18351E] mb-1.5">
                      WhatsApp com DDD <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={requesterPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="(12) 98170-5757"
                      className="w-full rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-4 py-3 text-[#18351E] outline-none focus:border-[#B8872E] text-sm"
                    />
                    <span className="text-[11px] text-[#8c7b6c] mt-1 block">
                      Enviaremos a confirmação neste número
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#18351E] mb-1.5">
                      E-mail <span className="text-xs text-[#8c7b6c]">(Opcional)</span>
                    </label>
                    <input
                      type="email"
                      value={requesterEmail}
                      onChange={(e) => setRequesterEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-4 py-3 text-[#18351E] outline-none focus:border-[#B8872E] text-sm"
                    />
                  </div>

                  {selectedService.requiresAddress ? (
                    <div>
                      <label className="block text-sm font-medium text-[#18351E] mb-1.5">
                        Grau de Parentesco / Relação <span className="text-xs text-[#8c7b6c]">(Opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={requesterRelationship}
                        onChange={(e) => setRequesterRelationship(e.target.value)}
                        placeholder="Ex.: Filho(a), Cônjuge, Vizinho(a)"
                        className="w-full rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-4 py-3 text-[#18351E] outline-none focus:border-[#B8872E] text-sm"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-[#18351E] mb-1.5">
                        Comunidade que frequenta <span className="text-xs text-[#8c7b6c]">(Opcional)</span>
                      </label>
                      <select
                        value={communityId}
                        onChange={(e) => setCommunityId(e.target.value)}
                        className="w-full rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-4 py-3 text-[#18351E] outline-none focus:border-[#B8872E] text-sm cursor-pointer"
                      >
                        <option value="">Selecione a comunidade...</option>
                        {communities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Se for Visita Domiciliar: Dados do Enfermo e Endereço */}
              {selectedService.requiresAddress && (
                <div className="space-y-4 pt-4 border-t border-[#D6A64A]/20">
                  <h3 className="text-xs font-bold text-[#a6824b] uppercase tracking-wider">
                    Dados do Enfermo / Idoso e Local da Visita
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-[#18351E] mb-1.5">
                      Nome do Enfermo / Idoso <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Nome de quem receberá a visita ou a Eucaristia"
                      className="w-full rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-4 py-3 text-[#18351E] outline-none focus:border-[#B8872E] text-sm"
                    />
                  </div>

                  {/* Checkboxes de Condição do Enfermo */}
                  <div>
                    <label className="block text-sm font-medium text-[#18351E] mb-2">
                      Condições do Enfermo (ajuda a equipe pastoral a se preparar)
                    </label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#D6A64A]/30 bg-[#fbf6ee] cursor-pointer hover:border-[#B8872E]">
                        <input
                          type="checkbox"
                          checked={isBedridden}
                          onChange={(e) => setIsBedridden(e.target.checked)}
                          className="size-4 accent-[#18351E]"
                        />
                        <span className="text-xs font-medium text-[#18351E]">Está acamado</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#D6A64A]/30 bg-[#fbf6ee] cursor-pointer hover:border-[#B8872E]">
                        <input
                          type="checkbox"
                          checked={canSwallowHost}
                          onChange={(e) => setCanSwallowHost(e.target.checked)}
                          className="size-4 accent-[#18351E]"
                        />
                        <span className="text-xs font-medium text-[#18351E]">Engole hóstia</span>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#D6A64A]/30 bg-[#fbf6ee] cursor-pointer hover:border-[#B8872E]">
                        <input
                          type="checkbox"
                          checked={isLucid}
                          onChange={(e) => setIsLucid(e.target.checked)}
                          className="size-4 accent-[#18351E]"
                        />
                        <span className="text-xs font-medium text-[#18351E]">Está lúcido</span>
                      </label>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div className="grid md:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-sm font-medium text-[#18351E] mb-1.5">
                        CEP <span className="text-xs text-[#8c7b6c]">(Preenche automático)</span>
                      </label>
                      <input
                        type="text"
                        value={cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                        placeholder="11671-180"
                        className="w-full rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-4 py-3 text-[#18351E] outline-none focus:border-[#B8872E] text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#18351E] mb-1.5">
                        Rua / Avenida <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Ex.: Rua Edson dos Santos"
                        className="w-full rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-4 py-3 text-[#18351E] outline-none focus:border-[#B8872E] text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#18351E] mb-1.5">
                        Número <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Ex.: 30"
                        className="w-full rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-4 py-3 text-[#18351E] outline-none focus:border-[#B8872E] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#18351E] mb-1.5">
                        Bairro <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Ex.: Morro do Algodão"
                        className="w-full rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-4 py-3 text-[#18351E] outline-none focus:border-[#B8872E] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#18351E] mb-1.5">
                        Complemento <span className="text-xs text-[#8c7b6c]">(Opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        placeholder="Ex.: Bloco B, Apto 12"
                        className="w-full rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-4 py-3 text-[#18351E] outline-none focus:border-[#B8872E] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#18351E] mb-1.5">
                      Ponto de Referência ou Observações de Acesso
                    </label>
                    <input
                      type="text"
                      value={referencePoint}
                      onChange={(e) => setReferencePoint(e.target.value)}
                      placeholder="Ex.: Portão verde ao lado da padaria, interfone 203"
                      className="w-full rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-4 py-3 text-[#18351E] outline-none focus:border-[#B8872E] text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Observação / Motivo */}
              <div className="pt-2">
                <label className="block text-sm font-medium text-[#18351E] mb-1.5">
                  Observações ou Intenção Particular <span className="text-xs text-[#8c7b6c]">(Opcional e confidencial)</span>
                </label>
                <textarea
                  rows={3}
                  value={requesterNotes}
                  onChange={(e) => setRequesterNotes(e.target.value)}
                  placeholder="Se desejar, escreva uma breve observação ou intenção para o sacerdote ou ministro..."
                  className="w-full rounded-xl border border-[#D6A64A]/40 bg-[#fbf6ee] px-4 py-3 text-[#18351E] outline-none focus:border-[#B8872E] text-sm resize-none"
                />
              </div>

              {/* Botões */}
              <div className="flex items-center justify-between pt-4 border-t border-[#D6A64A]/20">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="rounded-xl border border-[#D6A64A]/40 text-[#18351E] py-2.5 px-5 hover:bg-[#ECD6BD]/40 text-sm font-semibold cursor-pointer"
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#18351E] px-8 py-3 text-[#eeca94] hover:bg-[#27442A] transition-colors font-semibold text-sm cursor-pointer shadow-xs"
                >
                  <span>Revisar Agendamento</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 5: Revisão e Confirmação */}
        {currentStep === 5 && selectedService && selectedAgent && selectedSlot && (
          <div className="space-y-6 max-w-2xl">
            <div className="border-b border-[#D6A64A]/30 pb-3">
              <h2
                className="text-2xl md:text-3xl font-semibold text-[#18351E]"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                5. Revise e Confirme o Agendamento
              </h2>
              <p className="text-sm text-[#5A463B] mt-1">
                Verifique se todos os dados abaixo estão corretos antes de enviar.
              </p>
            </div>

            {formError && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 flex items-center gap-2">
                <AlertCircle size={18} className="shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-2xl p-6 lg:p-8 shadow-sm space-y-5">
              {/* Atendimento & Agente */}
              <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#fbf6ee] border border-[#D6A64A]/30">
                <div>
                  <span className="text-[11px] font-bold text-[#a6824b] uppercase tracking-wider block">
                    Atendimento
                  </span>
                  <span className="text-base font-bold text-[#18351E] block">
                    {selectedService.title}
                  </span>
                  <span className="text-xs text-[#5A463B]">
                    {selectedService.requiresAddress ? "Visita Domiciliar" : "Atendimento Presencial"} ({selectedService.defaultDurationMinutes} min)
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-[#a6824b] uppercase tracking-wider block">
                    Clérigo / Agente
                  </span>
                  <span className="text-base font-bold text-[#18351E] block">
                    {selectedAgent.title ? `${selectedAgent.title} ` : ""}
                    {selectedAgent.name}
                  </span>
                  <span className="text-xs text-[#5A463B]">{selectedAgent.actingRole}</span>
                </div>
              </div>

              {/* Data e Horário */}
              <div className="p-4 rounded-xl bg-[#fbf6ee] border border-[#D6A64A]/30 flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-[#B8872E] shrink-0" />
                <div>
                  <span className="text-sm font-bold text-[#18351E] block">
                    {formatDateDisplay(selectedDate)} às {selectedSlot.startTime} (até {selectedSlot.endTime})
                  </span>
                  <span className="text-xs text-[#5A463B]">
                    Horário de Brasília (America/Sao_Paulo)
                  </span>
                </div>
              </div>

              {/* Solicitante */}
              <div className="text-sm space-y-1">
                <span className="text-xs font-bold text-[#a6824b] uppercase tracking-wider block mb-1">
                  Solicitante
                </span>
                <p className="text-[#18351E] font-semibold">
                  {requesterName} {requesterRelationship ? `(${requesterRelationship})` : ""}
                </p>
                <p className="text-xs text-[#5A463B]">WhatsApp: {requesterPhone}</p>
                {requesterEmail && <p className="text-xs text-[#5A463B]">E-mail: {requesterEmail}</p>}
              </div>

              {/* Se for Visita Domiciliar */}
              {selectedService.requiresAddress && (
                <div className="pt-3 border-t border-[#D6A64A]/20 text-sm space-y-1">
                  <span className="text-xs font-bold text-[#a6824b] uppercase tracking-wider block mb-1">
                    Enfermo & Endereço da Visita
                  </span>
                  <p className="text-[#18351E] font-semibold">Enfermo(a): {patientName}</p>
                  <p className="text-xs text-[#5A463B]">
                    {street}, {number} {complement ? `(${complement})` : ""} — {neighborhood} {cep ? `— CEP ${cep}` : ""}
                  </p>
                  {referencePoint && (
                    <p className="text-xs text-[#8c7b6c] italic">Ref: {referencePoint}</p>
                  )}
                  <div className="flex gap-2 pt-1 text-[11px] text-[#5A463B]">
                    {isBedridden && <span className="bg-[#f0e7d8] px-2 py-0.5 rounded">Acamado</span>}
                    {canSwallowHost && <span className="bg-[#f0e7d8] px-2 py-0.5 rounded">Engole Hóstia</span>}
                    {isLucid && <span className="bg-[#f0e7d8] px-2 py-0.5 rounded">Lúcido</span>}
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex items-center justify-between pt-4 border-t border-[#D6A64A]/20">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="rounded-xl border border-[#D6A64A]/40 text-[#18351E] py-2.5 px-5 hover:bg-[#ECD6BD]/40 text-sm font-semibold cursor-pointer"
                >
                  Voltar e Editar
                </button>

                <button
                  type="button"
                  disabled={createAppointmentMutation.isPending}
                  onClick={handleFinalSubmit}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#18351E] px-8 py-3.5 text-[#eeca94] hover:bg-[#27442A] transition-colors font-semibold text-sm cursor-pointer shadow-md disabled:opacity-60"
                >
                  {createAppointmentMutation.isPending ? (
                    <>
                      <div className="size-4 border-2 border-[#D6A64A]/30 border-t-[#D6A64A] rounded-full animate-spin" />
                      <span>Confirmando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      <span>Confirmar Agendamento</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Sucesso e Comprovante */}
        {currentStep === 6 && createdAppointment && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-[#fbf5eb] border border-[#D6A64A]/60 rounded-2xl p-8 lg:p-10 shadow-md text-center">
              <div className="size-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mx-auto mb-4">
                <CheckCircle size={34} />
              </div>

              <h2
                className="text-3xl md:text-4xl font-bold text-[#18351E] mb-2"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Agendamento Confirmado!
              </h2>

              <p className="text-sm text-[#5A463B] max-w-lg mx-auto leading-relaxed">
                Sua solicitação de atendimento foi registrada com sucesso na Paróquia São José.
                Guardamos o seu horário com muito carinho e oração.
              </p>

              {/* Caixa de Token / Código de Acompanhamento */}
              <div className="mt-8 p-5 bg-[#fbf6ee] border border-[#D6A64A]/50 rounded-2xl text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#a6824b] uppercase tracking-wider">
                    Seu Código de Acompanhamento
                  </span>
                  <button
                    onClick={handleCopyToken}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#18351E] hover:text-[#B8872E] cursor-pointer"
                  >
                    {copiedToken ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                    {copiedToken ? "Copiado!" : "Copiar Código"}
                  </button>
                </div>

                <div className="bg-white border border-[#D6A64A]/30 rounded-xl px-4 py-2.5 font-mono text-sm text-[#18351E] break-all select-all font-semibold">
                  {createdAppointment.accessToken}
                </div>

                <p className="text-[11px] text-[#8c7b6c] mt-2">
                  Guarde este código para consultar o status ou cancelar seu atendimento caso tenha imprevistos, sem precisar de cadastro ou senha.
                </p>

                <div className="mt-3 pt-3 border-t border-[#D6A64A]/20 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#18351E] hover:text-[#B8872E] bg-[#fbf5eb] px-3 py-1.5 rounded-lg border border-[#D6A64A]/40 cursor-pointer"
                  >
                    {copiedLink ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                    {copiedLink ? "Link Copiado!" : "Copiar Link de Acompanhamento"}
                  </button>

                  <Link
                    href={`/agendamentos/acompanhar?token=${createdAppointment.accessToken}`}
                    className="text-xs font-bold text-[#18351E] hover:text-[#B8872E] inline-flex items-center gap-1"
                  >
                    Abrir página de acompanhamento <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Resumo do Atendimento */}
              <div className="mt-6 p-4 rounded-xl bg-[#fbf6ee] border border-[#D6A64A]/30 text-left text-xs text-[#5A463B] space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#18351E]">Atendimento:</span>
                  <span>{selectedService?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#18351E]">Agente Pastoral:</span>
                  <span>{selectedAgent?.title} {selectedAgent?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#18351E]">Data e Horário:</span>
                  <span className="font-bold text-[#18351E]">
                    {formatDateDisplay(createdAppointment.appointmentDate)} às {createdAppointment.startTime}
                  </span>
                </div>
              </div>

              {/* Botões de Ação Final */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    downloadAppointmentIcs({
                      serviceTitle: selectedService?.title || "Atendimento Pastoral",
                      agentName: `${selectedAgent?.title ? selectedAgent.title + " " : ""}${selectedAgent?.name}`,
                      date: createdAppointment.appointmentDate,
                      startTime: createdAppointment.startTime,
                      endTime: createdAppointment.endTime,
                      address: createdAppointment.patientAddress || "Paróquia São José",
                      description: createdAppointment.requesterNotes,
                    })
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#D6A64A]/60 bg-[#fbf5eb] px-6 py-3 text-sm font-semibold text-[#18351E] hover:bg-[#ECD6BD]/40 transition-colors cursor-pointer"
                >
                  <Download size={16} className="text-[#B8872E]" />
                  <span>Adicionar ao Calendário (.ics)</span>
                </button>

                <a
                  href={
                    contact?.whatsappUrl ||
                    (contact?.whatsapp
                      ? `https://wa.me/55${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Olá! Realizei o agendamento de ${selectedService?.title} (Código: ${createdAppointment.accessToken}).`
                        )}`
                      : "https://wa.me/5512981705757")
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#18351E] px-6 py-3 text-sm font-semibold text-[#eeca94] hover:bg-[#27442A] transition-colors cursor-pointer shadow-xs"
                >
                  <MessageCircle size={16} />
                  <span>Dúvidas? WhatsApp da Secretaria</span>
                </a>
              </div>
            </div>
          </div>
        )}
          </>
        )}
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
