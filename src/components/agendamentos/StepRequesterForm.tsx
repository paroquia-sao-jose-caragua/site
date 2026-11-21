"use client";

import { AlertCircle, ChevronDown } from "lucide-react";
import type { AppointmentService } from "@/entities/appointment";

interface CommunityOption {
  id: string;
  name: string;
}

interface StepRequesterFormProps {
  formId: string;
  selectedService: AppointmentService;
  communities: CommunityOption[];
  formError: string;
  requesterName: string;
  onChangeRequesterName: (v: string) => void;
  requesterPhone: string;
  onChangeRequesterPhone: (v: string) => void;
  requesterEmail: string;
  onChangeRequesterEmail: (v: string) => void;
  requesterRelationship: string;
  onChangeRequesterRelationship: (v: string) => void;
  communityId: string;
  onChangeCommunityId: (v: string) => void;
  patientName: string;
  onChangePatientName: (v: string) => void;
  isBedridden: boolean;
  onChangeIsBedridden: (v: boolean) => void;
  canSwallowHost: boolean;
  onChangeCanSwallowHost: (v: boolean) => void;
  isLucid: boolean;
  onChangeIsLucid: (v: boolean) => void;
  cep: string;
  onChangeCep: (v: string) => void;
  street: string;
  onChangeStreet: (v: string) => void;
  number: string;
  onChangeNumber: (v: string) => void;
  neighborhood: string;
  onChangeNeighborhood: (v: string) => void;
  complement: string;
  onChangeComplement: (v: string) => void;
  referencePoint: string;
  onChangeReferencePoint: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputClass =
  "w-full rounded-xl border border-[#D6A64A]/40 bg-white/95 px-4 py-3 text-sm text-[#18351E] placeholder:text-[#a39485] outline-none focus:border-[#B8872E] shadow-2xs";

export function StepRequesterForm({
  formId,
  selectedService,
  communities,
  formError,
  requesterName,
  onChangeRequesterName,
  requesterPhone,
  onChangeRequesterPhone,
  requesterEmail,
  onChangeRequesterEmail,
  requesterRelationship,
  onChangeRequesterRelationship,
  communityId,
  onChangeCommunityId,
  patientName,
  onChangePatientName,
  isBedridden,
  onChangeIsBedridden,
  canSwallowHost,
  onChangeCanSwallowHost,
  isLucid,
  onChangeIsLucid,
  cep,
  onChangeCep,
  street,
  onChangeStreet,
  number,
  onChangeNumber,
  neighborhood,
  onChangeNeighborhood,
  complement,
  onChangeComplement,
  referencePoint,
  onChangeReferencePoint,
  onSubmit,
}: StepRequesterFormProps) {
  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-6 max-w-xl">
      <div>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#18351E]"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Seus dados
        </h2>
        <p className="text-sm sm:text-base text-[#5A463B] mt-1.5">
          Usaremos apenas para confirmar o atendimento.
        </p>
      </div>

      {formError && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span>{formError}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#18351E] mb-1.5">
            Nome completo <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            required
            value={requesterName}
            onChange={(e) => onChangeRequesterName(e.target.value)}
            placeholder="Seu nome completo"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#18351E] mb-1.5">
            WhatsApp com DDD <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            required
            value={requesterPhone}
            onChange={(e) => onChangeRequesterPhone(e.target.value)}
            placeholder="(12) 98170-5757"
            className={inputClass}
          />
          <span className="text-[11px] text-[#8c7b6c] mt-1 block">
            Enviaremos a confirmação neste número
          </span>
        </div>

        {selectedService.requiresAddress ? (
          <div>
            <label className="block text-sm font-semibold text-[#18351E] mb-1.5">
              Grau de Parentesco / Relação{" "}
              <span className="font-normal text-[#8c7b6c]">(opcional)</span>
            </label>
            <input
              type="text"
              value={requesterRelationship}
              onChange={(e) => onChangeRequesterRelationship(e.target.value)}
              placeholder="Ex.: Filho(a), Cônjuge, Vizinho(a)"
              className={inputClass}
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-[#18351E] mb-1.5">
              Comunidade que frequenta{" "}
              <span className="font-normal text-[#8c7b6c]">(opcional)</span>
            </label>
            <div className="relative">
              <select
                value={communityId}
                onChange={(e) => onChangeCommunityId(e.target.value)}
                className={`${inputClass} appearance-none pr-10 cursor-pointer`}
              >
                <option value="">Selecione a comunidade...</option>
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c7b6c]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Campos condicionais para Visita Domiciliar */}
      {selectedService.requiresAddress && (
        <div className="space-y-4 pt-5 border-t border-[#D6A64A]/25">
          <h3 className="text-xs font-bold text-[#a6824b] uppercase tracking-wider">
            Dados do Enfermo / Idoso e Local da Visita
          </h3>

          <div>
            <label className="block text-sm font-semibold text-[#18351E] mb-1.5">
              Nome do Enfermo / Idoso <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => onChangePatientName(e.target.value)}
              placeholder="Nome de quem receberá a visita ou a Eucaristia"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#18351E] mb-2">
              Condições do Enfermo
            </label>
            <div className="grid sm:grid-cols-3 gap-2.5">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#D6A64A]/35 bg-white/95 cursor-pointer hover:border-[#B8872E]">
                <input
                  type="checkbox"
                  checked={isBedridden}
                  onChange={(e) => onChangeIsBedridden(e.target.checked)}
                  className="size-4 accent-[#18351E]"
                />
                <span className="text-sm font-medium text-[#18351E]">Está acamado</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#D6A64A]/35 bg-white/95 cursor-pointer hover:border-[#B8872E]">
                <input
                  type="checkbox"
                  checked={canSwallowHost}
                  onChange={(e) => onChangeCanSwallowHost(e.target.checked)}
                  className="size-4 accent-[#18351E]"
                />
                <span className="text-sm font-medium text-[#18351E]">Engole hóstia</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#D6A64A]/35 bg-white/95 cursor-pointer hover:border-[#B8872E]">
                <input
                  type="checkbox"
                  checked={isLucid}
                  onChange={(e) => onChangeIsLucid(e.target.checked)}
                  className="size-4 accent-[#18351E]"
                />
                <span className="text-sm font-medium text-[#18351E]">Está lúcido</span>
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#18351E] mb-1.5">
                CEP <span className="text-xs font-normal text-[#8c7b6c]">(automático)</span>
              </label>
              <input
                type="text"
                value={cep}
                onChange={(e) => onChangeCep(e.target.value)}
                placeholder="11671-180"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[#18351E] mb-1.5">
                Rua / Avenida <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => onChangeStreet(e.target.value)}
                placeholder="Ex.: Rua Edson dos Santos"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#18351E] mb-1.5">
                Número <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={number}
                onChange={(e) => onChangeNumber(e.target.value)}
                placeholder="Ex.: 30"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#18351E] mb-1.5">
                Bairro <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => onChangeNeighborhood(e.target.value)}
                placeholder="Ex.: Morro do Algodão"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#18351E] mb-1.5">
                Complemento
              </label>
              <input
                type="text"
                value={complement}
                onChange={(e) => onChangeComplement(e.target.value)}
                placeholder="Bloco / Apto"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#18351E] mb-1.5">
              Ponto de Referência ou Acesso
            </label>
            <input
              type="text"
              value={referencePoint}
              onChange={(e) => onChangeReferencePoint(e.target.value)}
              placeholder="Ex.: Portão verde ao lado da padaria, interfone 203"
              className={inputClass}
            />
          </div>
        </div>
      )}
    </form>
  );
}
