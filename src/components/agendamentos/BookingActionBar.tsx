"use client";

import { BOOKING_STEPS } from "./BookingStepper";

interface BookingActionBarProps {
  currentStep: number;
  canContinue: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onContinue?: () => void;
  submitFormId?: string;
}

export function BookingActionBar({
  currentStep,
  canContinue,
  isSubmitting = false,
  onBack,
  onContinue,
  submitFormId,
}: BookingActionBarProps) {
  const isFinalFormStep = currentStep === 4;
  const activeStepItem = BOOKING_STEPS.find((s) => s.step === currentStep);
  const stepTitle = activeStepItem
    ? activeStepItem.label.replace(/^\d+\.\s*/, "")
    : "";

  return (
    <div className="fixed bottom-16 min-[950px]:bottom-0 inset-x-0 z-30 bg-[#fbf6ee]/95 backdrop-blur-md border-t border-[#D6A64A]/35 shadow-[0_-4px_20px_rgba(24,53,30,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between md:grid md:grid-cols-3 gap-3">
        <div className="md:justify-self-start">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="rounded-full border border-[#D6A64A]/50 bg-white text-[#18351E] px-6 py-2.5 text-sm font-semibold hover:bg-[#ECD6BD]/40 transition-colors cursor-pointer disabled:opacity-45"
            >
              Voltar
            </button>
          ) : (
            <div aria-hidden="true" />
          )}
        </div>

        {/* Indicador centralizado no desktop */}
        <div className="hidden md:flex flex-col items-center justify-self-center text-center leading-tight">
          <span className="text-sm font-semibold text-[#18351E]">
            {stepTitle}
          </span>
          <span className="text-xs text-[#8c7b6c] mt-0.5">
            {currentStep} de {BOOKING_STEPS.length}
          </span>
        </div>

        <div className="ml-auto md:ml-0 md:justify-self-end">
          {isFinalFormStep && submitFormId ? (
            <button
              type="submit"
              form={submitFormId}
              disabled={!canContinue || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#18351E] px-7 py-2.5 text-sm font-semibold text-[#eeca94] hover:bg-[#27442A] transition-colors cursor-pointer shadow-xs disabled:opacity-45 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="size-4 border-2 border-[#D6A64A]/30 border-t-[#D6A64A] rounded-full animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <span>Enviar solicitação</span>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={!canContinue}
              onClick={onContinue}
              className="rounded-full bg-[#18351E] px-7 py-2.5 text-sm font-semibold text-[#eeca94] hover:bg-[#27442A] transition-colors cursor-pointer shadow-xs disabled:opacity-45 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
