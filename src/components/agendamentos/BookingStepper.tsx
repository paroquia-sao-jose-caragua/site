"use client";

import { Check } from "lucide-react";

export interface StepItem {
  step: number;
  label: string;
}

export const BOOKING_STEPS: StepItem[] = [
  { step: 1, label: "1. Atendimento" },
  { step: 2, label: "2. Dia e horário" },
  { step: 3, label: "3. Observações" },
  { step: 4, label: "4. Seus dados" },
  { step: 5, label: "5. Solicitação" },
];

interface BookingStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  isConfirmed?: boolean;
}

export function BookingStepper({
  currentStep,
  onStepClick,
  isConfirmed = false,
}: BookingStepperProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {BOOKING_STEPS.map((item) => {
          const isActive = currentStep === item.step;
          const isPassed = currentStep > item.step;
          const canNavigate = isPassed && !isConfirmed;

          return (
            <button
              key={item.step}
              type="button"
              disabled={!canNavigate}
              onClick={() => canNavigate && onStepClick(item.step)}
              className={`shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs transition-all ${
                isActive
                  ? "bg-[#ECD6BD]/70 text-[#18351E] font-semibold"
                  : isPassed
                  ? `text-[#5A463B] font-medium ${
                      canNavigate
                        ? "hover:bg-[#ECD6BD]/35 hover:text-[#18351E] cursor-pointer"
                        : "cursor-default"
                    }`
                  : "text-[#a39485] cursor-default"
              }`}
            >
              {isPassed && (
                <Check size={11} className="text-[#a6824b] shrink-0" />
              )}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
