"use client";

import type { AppointmentService, PastoralAgent } from "@/entities/appointment";

interface StepTopicNotesProps {
  selectedService: AppointmentService;
  selectedAgent: PastoralAgent;
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
  requesterNotes: string;
  onChangeNotes: (notes: string) => void;
}

function getSuggestedTopics(service: AppointmentService): string[] {
  const titleLower = service.title.toLowerCase();
  if (titleLower.includes("confissão")) {
    return [
      "Primeira confissão",
      "Confissão após longo tempo",
      "Confissão regular",
      "Outro",
    ];
  }
  if (service.requiresAddress || titleLower.includes("enfermo")) {
    return [
      "Unção dos Enfermos",
      "Sagrada Comunhão",
      "Oração e bênção",
      "Outro",
    ];
  }
  if (titleLower.includes("direção") || titleLower.includes("aconselhamento")) {
    return [
      "Orientação espiritual",
      "Discernimento",
      "Aconselhamento familiar",
      "Outro",
    ];
  }
  return [
    "Conversa pastoral",
    "Oração / Bênção",
    "Dúvida sacramental",
    "Outro",
  ];
}

export function StepTopicNotes({
  selectedService,
  selectedAgent,
  selectedTopic,
  onSelectTopic,
  requesterNotes,
  onChangeNotes,
}: StepTopicNotesProps) {
  const topics = getSuggestedTopics(selectedService);
  const agentName = `${selectedAgent.title ? `${selectedAgent.title} ` : ""}${selectedAgent.name}`;

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#18351E]"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Sobre o que deseja conversar?
        </h2>
        <p className="text-sm sm:text-base text-[#5A463B] mt-1.5">
          Isso ajuda {agentName} a se preparar para acolher você.
        </p>
      </div>

      {/* Chips de seleção rápida (opcionais) */}
      <div className="flex flex-wrap gap-2.5">
        {topics.map((topic) => {
          const isSelected = selectedTopic === topic;
          return (
            <button
              key={topic}
              type="button"
              onClick={() => onSelectTopic(isSelected ? "" : topic)}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#ECD6BD]/60 text-[#18351E] border-[#D6A64A]/40 shadow-xs"
                  : "bg-[#FDFBF7] border-[#D6A64A]/35 text-[#18351E] hover:border-[#B8872E] hover:bg-[#ECD6BD]/30"
              }`}
            >
              {topic}
            </button>
          );
        })}
      </div>

      {/* Campo livre opcional */}
      <div>
        <label className="block text-sm font-semibold text-[#18351E] mb-2">
          Quer contar algo mais?{" "}
          <span className="font-normal text-[#8c7b6c]">(opcional e confidencial)</span>
        </label>
        <textarea
          rows={4}
          value={requesterNotes}
          onChange={(e) => onChangeNotes(e.target.value)}
          placeholder="Se desejar, escreva uma breve observação ou intenção para o sacerdote ou ministro..."
          className="w-full rounded-2xl border border-[#D6A64A]/35 bg-[#FDFBF7] px-4 py-3 text-sm text-[#18351E] placeholder:text-[#a39485] outline-none focus:border-[#B8872E] resize-none shadow-2xs"
        />
      </div>
    </div>
  );
}
