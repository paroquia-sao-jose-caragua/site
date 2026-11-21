"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  MessageCircle,
  Phone,
  ShieldCheck,
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
} from "@/entities/appointment";
import { useCommunities } from "@/lib/api/communities/use-communities";
import { useParishContact } from "@/lib/api/parish-contact/use-parish-contact";
import { useBookingStore } from "@/stores/useBookingStore";
import { BookingStepper } from "@/components/agendamentos/BookingStepper";
import { BookingSummarySidebar } from "@/components/agendamentos/BookingSummarySidebar";
import { BookingActionBar } from "@/components/agendamentos/BookingActionBar";
import { StepServiceSelection } from "@/components/agendamentos/StepServiceSelection";
import { StepDateTimeSelection } from "@/components/agendamentos/StepDateTimeSelection";
import { StepTopicNotes } from "@/components/agendamentos/StepTopicNotes";
import { StepRequesterForm } from "@/components/agendamentos/StepRequesterForm";
import { StepConfirmation } from "@/components/agendamentos/StepConfirmation";

function getFirstAvailableDateStr(): string {
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayOfWeek = d.getDay();
    if (dayOfWeek >= 2 && dayOfWeek <= 6) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
  }
  return "";
}

export default function AgendamentosPage() {
  const {
    currentStep,
    selectedService,
    selectedAgent,
    selectedDate,
    selectedSlot,
    selectedTopic,
    requesterNotes,
    requesterName,
    requesterPhone,
    requesterEmail,
    requesterRelationship,
    communityId,
    patientName,
    cep,
    street,
    number,
    neighborhood,
    complement,
    referencePoint,
    isBedridden,
    canSwallowHost,
    isLucid,
    createdAppointment,
    _hasHydrated,
    setCurrentStep,
    setSelectedService,
    setSelectedAgent,
    setSelectedDate,
    setSelectedSlot,
    setSelectedTopic,
    setRequesterNotes,
    setRequesterName,
    setRequesterPhone,
    setRequesterEmail,
    setRequesterRelationship,
    setCommunityId,
    setPatientName,
    setCep,
    setStreet,
    setNumber,
    setNeighborhood,
    setComplement,
    setReferencePoint,
    setIsBedridden,
    setCanSwallowHost,
    setIsLucid,
    setCreatedAppointment,
    resetBooking,
  } = useBookingStore();

  // Ephemeral UI state
  const [formError, setFormError] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Queries
  const { data: settings, isLoading: isLoadingSettings } =
    useAppointmentSettings();
  const { data: services = [], isLoading: isLoadingServices } =
    useAppointmentServices();
  const availableServices = useMemo(
    () => services.filter((service) => service.active !== false),
    [services]
  );

  const { data: agents = [], isLoading: isLoadingAgents } = usePastoralAgents(
    selectedService?.id
  );

  const { data: availableSlots = [], isLoading: isLoadingSlots } =
    useAvailableSlots(selectedAgent?.id, selectedDate, selectedService?.id);

  const { communities = [] } = useCommunities();
  const { contact } = useParishContact();
  const createAppointmentMutation = useCreateAppointment();

  // Auto-select single agent when service has exactly 1 agent
  useEffect(() => {
    if (
      currentStep === 2 &&
      !isLoadingAgents &&
      agents.length === 1 &&
      (!selectedAgent || selectedAgent.id !== agents[0].id)
    ) {
      setSelectedAgent(agents[0]);
      if (!selectedDate) {
        setSelectedDate(getFirstAvailableDateStr());
      }
    }
  }, [
    currentStep,
    isLoadingAgents,
    agents,
    selectedAgent,
    selectedDate,
    setSelectedAgent,
    setSelectedDate,
  ]);

  // Combined notes for summary and API submission
  const combinedNotes = useMemo(() => {
    const parts = [
      selectedTopic.trim() || null,
      requesterNotes.trim() || null,
    ].filter(Boolean);
    return parts.join(" — ");
  }, [selectedTopic, requesterNotes]);

  const parishWhatsappNumber = contact?.whatsapp || "(12) 98170-5757";
  const cleanWhatsapp = parishWhatsappNumber.replace(/\D/g, "");
  const defaultBookingMsg = encodeURIComponent(
    "Olá! Gostaria de agendar um atendimento pastoral na Paróquia São José."
  );
  const parishWhatsappUrl = contact?.whatsappUrl
    ? contact.whatsappUrl.includes("text=")
      ? contact.whatsappUrl
      : `${contact.whatsappUrl}?text=${defaultBookingMsg}`
    : `https://wa.me/55${cleanWhatsapp}?text=${defaultBookingMsg}`;

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

  const handleSelectService = (service: AppointmentService) => {
    setSelectedService(service);
    setSelectedAgent(null);
    setSelectedSlot(null);
    setSelectedDate(getFirstAvailableDateStr());
    setFormError("");
  };

  const handleSelectAgent = (agent: PastoralAgent) => {
    setSelectedAgent(agent);
    setSelectedSlot(null);
    if (!selectedDate) {
      setSelectedDate(getFirstAvailableDateStr());
    }
  };

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlot(null);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!requesterName.trim()) {
      setFormError("Por favor, preencha o seu nome completo.");
      return;
    }
    if (
      !requesterPhone.trim() ||
      requesterPhone.replace(/\D/g, "").length < 10
    ) {
      setFormError("Por favor, informe um WhatsApp válido com DDD.");
      return;
    }

    if (selectedService?.requiresAddress) {
      if (!patientName.trim()) {
        setFormError(
          "Por favor, informe o nome do enfermo ou idoso acamado."
        );
        return;
      }
      if (!street.trim() || !number.trim() || !neighborhood.trim()) {
        setFormError(
          "Por favor, informe o endereço completo (Rua, Número e Bairro)."
        );
        return;
      }
    }

    if (!selectedService || !selectedAgent || !selectedDate || !selectedSlot) {
      setFormError(
        "Dados do agendamento incompletos. Por favor, revise os passos anteriores."
      );
      return;
    }

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
            }
          : undefined,
        requesterNotes: combinedNotes || undefined,
      });

      setCreatedAppointment(result);
      setCurrentStep(5);
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

  const handleCopyLink = () => {
    if (!trackingUrl) return;
    navigator.clipboard.writeText(trackingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleResetBooking = () => {
    setFormError("");
    setCopiedLink(false);
    resetBooking();
  };

  const whatsappSupportUrl =
    contact?.whatsappUrl ||
    (contact?.whatsapp && createdAppointment
      ? `https://wa.me/55${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
          `Olá! Realizei o agendamento de ${selectedService?.title} (Código: ${createdAppointment.accessToken}).`
        )}`
      : parishWhatsappUrl);

  const canContinueStep = (() => {
    if (currentStep === 1) return Boolean(selectedService);
    if (currentStep === 2)
      return Boolean(selectedAgent && selectedDate && selectedSlot);
    if (currentStep === 3) return true;
    if (currentStep === 4) {
      const hasBasic =
        Boolean(requesterName.trim()) &&
        requesterPhone.replace(/\D/g, "").length >= 10;
      if (!selectedService?.requiresAddress) return hasBasic;
      return (
        hasBasic &&
        Boolean(patientName.trim()) &&
        Boolean(street.trim()) &&
        Boolean(number.trim()) &&
        Boolean(neighborhood.trim())
      );
    }
    return false;
  })();

  return (
    <section className="relative overflow-hidden bg-[#fbf6ee] min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-36">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#8c7b6c] mb-6 flex items-center gap-2 font-medium">
          <Link href="/" className="hover:text-[#2d261e] transition-colors">
            Início
          </Link>
          <span>&gt;</span>
          <span className="text-[#2d261e]">Agendamentos</span>
        </nav>

        {/* Loading, Hydration or Disabled State */}
        {!_hasHydrated || isLoadingSettings || isLoadingServices ? (
          <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
            <div className="size-10 border-2 border-[#D6A64A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#8c7b6c]">
              Verificando disponibilidade de agendamentos...
            </p>
          </div>
        ) : !settings?.enabled || availableServices.length === 0 ? (
          <div className="max-w-xl mx-auto py-12 text-center">
            <div className="size-14 mx-auto rounded-full bg-[#ECD6BD]/50 flex items-center justify-center text-[#B8872E] mb-4">
              <MessageCircle className="w-7 h-7 text-[#B8872E]" />
            </div>

            <p className="text-lg md:text-xl text-[#18351E] font-medium max-w-md mx-auto mb-6">
              Os agendamentos estão sendo realizados diretamente pela Secretaria Paroquial.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <a
                href={parishWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#18351E] px-6 py-3 text-sm font-semibold text-[#f5ebd7] hover:bg-[#27442A] transition-all shadow-sm cursor-pointer"
              >
                <MessageCircle size={18} className="text-[#D6A64A]" />
                <span>Agendar pelo WhatsApp: {parishWhatsappNumber}</span>
              </a>

              {contact?.phone && (
                <a
                  href={`tel:${contact.phone.replace(/\D/g, "")}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#D6A64A]/50 bg-white px-5 py-3 text-sm font-semibold text-[#18351E] hover:bg-[#ECD6BD]/40 transition-colors shadow-2xs"
                >
                  <Phone size={16} className="text-[#B8872E]" />
                  <span>Ligar: {contact.phone}</span>
                </a>
              )}
            </div>

            {contact?.officeHours && (
              <p className="text-xs text-[#8c7b6c] max-w-md mx-auto">
                <Clock
                  size={13}
                  className="inline mr-1 -mt-0.5 text-[#a6824b]"
                />
                Horário da secretaria:{" "}
                {contact.officeHours.replace(/\n/g, " • ")}
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Horizontal Pill Stepper */}
            <BookingStepper
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              isConfirmed={currentStep === 5}
            />

            {/* Two-Column Desktop Layout + Responsive Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_370px] gap-8 items-start">
              {/* Main Left Column */}
              <div className="min-w-0">
                {/* Mobile Collapsible Summary (placed above step content on mobile) */}
                <div className="lg:hidden">
                  <BookingSummarySidebar
                    currentStep={currentStep}
                    selectedService={selectedService}
                    selectedAgent={selectedAgent}
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    selectedTopic={selectedTopic}
                    requesterName={requesterName}
                    requesterPhone={requesterPhone}
                    requesterEmail={requesterEmail}
                    patientName={patientName}
                  />
                </div>

                {currentStep === 1 && (
                  <StepServiceSelection
                    services={availableServices}
                    selectedService={selectedService}
                    isLoading={isLoadingServices}
                    onSelectService={handleSelectService}
                  />
                )}

                {currentStep === 2 && selectedService && (
                  <StepDateTimeSelection
                    selectedService={selectedService}
                    agents={agents}
                    isLoadingAgents={isLoadingAgents}
                    selectedAgent={selectedAgent}
                    onSelectAgent={handleSelectAgent}
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                    availableSlots={availableSlots}
                    isLoadingSlots={isLoadingSlots}
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    parishWhatsappUrl={parishWhatsappUrl}
                    onBack={() => setCurrentStep(1)}
                  />
                )}

                {currentStep === 3 && selectedService && selectedAgent && (
                  <StepTopicNotes
                    selectedService={selectedService}
                    selectedAgent={selectedAgent}
                    selectedTopic={selectedTopic}
                    onSelectTopic={setSelectedTopic}
                    requesterNotes={requesterNotes}
                    onChangeNotes={setRequesterNotes}
                  />
                )}

                {currentStep === 4 &&
                  selectedService &&
                  selectedAgent &&
                  selectedSlot && (
                    <StepRequesterForm
                      formId="agendamento-requester-form"
                      selectedService={selectedService}
                      communities={communities}
                      formError={formError}
                      requesterName={requesterName}
                      onChangeRequesterName={setRequesterName}
                      requesterPhone={requesterPhone}
                      onChangeRequesterPhone={handlePhoneChange}
                      requesterEmail={requesterEmail}
                      onChangeRequesterEmail={setRequesterEmail}
                      requesterRelationship={requesterRelationship}
                      onChangeRequesterRelationship={setRequesterRelationship}
                      communityId={communityId}
                      onChangeCommunityId={setCommunityId}
                      patientName={patientName}
                      onChangePatientName={setPatientName}
                      isBedridden={isBedridden}
                      onChangeIsBedridden={setIsBedridden}
                      canSwallowHost={canSwallowHost}
                      onChangeCanSwallowHost={setCanSwallowHost}
                      isLucid={isLucid}
                      onChangeIsLucid={setIsLucid}
                      cep={cep}
                      onChangeCep={handleCepChange}
                      street={street}
                      onChangeStreet={setStreet}
                      number={number}
                      onChangeNumber={setNumber}
                      neighborhood={neighborhood}
                      onChangeNeighborhood={setNeighborhood}
                      complement={complement}
                      onChangeComplement={setComplement}
                      referencePoint={referencePoint}
                      onChangeReferencePoint={setReferencePoint}
                      onSubmit={handleSubmitForm}
                    />
                  )}

                {currentStep === 5 && createdAppointment && (
                  <StepConfirmation
                    createdAppointment={createdAppointment}
                    selectedService={selectedService}
                    selectedAgent={selectedAgent}
                    requesterName={requesterName}
                    requesterEmail={requesterEmail}
                    requesterPhone={requesterPhone}
                    trackingUrl={trackingUrl}
                    copiedLink={copiedLink}
                    onCopyLink={handleCopyLink}
                    whatsappSupportUrl={whatsappSupportUrl}
                    onReset={handleResetBooking}
                  />
                )}
              </div>

              {/* Desktop Sticky Summary Sidebar */}
              <div className="hidden lg:block">
                <BookingSummarySidebar
                  currentStep={currentStep}
                  selectedService={selectedService}
                  selectedAgent={selectedAgent}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  selectedTopic={selectedTopic}
                  requesterName={requesterName}
                  requesterPhone={requesterPhone}
                  requesterEmail={requesterEmail}
                  patientName={patientName}
                />
              </div>
            </div>

            {currentStep < 5 && (
              <BookingActionBar
                currentStep={currentStep}
                canContinue={canContinueStep}
                isSubmitting={createAppointmentMutation.isPending}
                onBack={() => setCurrentStep(Math.max(1, currentStep - 1))}
                onContinue={() => setCurrentStep(Math.min(4, currentStep + 1))}
                submitFormId="agendamento-requester-form"
              />
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
