"use client";

import { Clock } from "lucide-react";
import type { AppointmentService } from "@/entities/appointment";

interface StepServiceSelectionProps {
  services: AppointmentService[];
  selectedService: AppointmentService | null;
  isLoading: boolean;
  onSelectService: (service: AppointmentService) => void;
}

function getServiceSubtitleTag(service: AppointmentService) {
  const titleLower = service.title.toLowerCase();
  if (titleLower.includes("confissão")) return "Sacramento da Penitência";
  if (titleLower.includes("direção")) return "Acompanhamento Espiritual";
  if (service.requiresAddress) return "Visita Domiciliar";
  if (titleLower.includes("aconselhamento")) return "Escuta & Orientação";
  return "Atendimento Presencial";
}

export function StepServiceSelection({
  services,
  selectedService,
  isLoading,
  onSelectService,
}: StepServiceSelectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#18351E]"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Que atendimento você procura?
        </h2>
        <p className="text-sm sm:text-base text-[#5A463B] mt-1.5">
          Selecione o serviço que melhor atende à sua necessidade espiritual ou de sua família.
        </p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-white/80 border border-[#D6A64A]/20 animate-pulse p-5"
            />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {services.map((service) => {
            const tag = getServiceSubtitleTag(service);
            const isSelected = selectedService?.id === service.id;

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => onSelectService(service)}
                className={`group text-left rounded-2xl p-5 transition-all cursor-pointer flex items-center gap-4 border ${
                  isSelected
                    ? "bg-[#18351E] text-[#eeca94] border-[#18351E] shadow-sm"
                    : "bg-white/95 border-[#D6A64A]/30 text-[#18351E] shadow-2xs hover:border-[#B8872E] hover:shadow-md"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <h3
                    className={`text-xl font-bold transition-colors leading-snug ${
                      isSelected
                        ? "text-[#eeca94]"
                        : "text-[#18351E] group-hover:text-[#B8872E]"
                    }`}
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {service.title}
                  </h3>

                  <div
                    className={`mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 justify-between text-sm font-semibold ${
                      isSelected ? "text-[#D6A64A]" : "text-[#8c5e2a]"
                    }`}
                  >
                    <span>{tag}</span>
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        isSelected ? "text-[#eeca94]/80" : "text-[#8c7b6c]"
                      }`}
                    >
                      <Clock size={12} />
                      {service.defaultDurationMinutes} min
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
