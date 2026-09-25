"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Heart,
  ChevronRight,
  HeartIcon,
  PhoneIcon,
  QrCode,
  Sparkles,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { generatePixPayload } from "@/utils/pix";
import Link from "next/link";
import { useDonations } from "@/lib/api/donations/use-donations";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={[
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-md transition-all cursor-pointer",
        copied
          ? "bg-green-50 border-green-300 text-green-700"
          : "border-[#D6A64A]/60 text-[#18351E] hover:bg-[#ECD6BD]/40",
      ].join(" ")}
      style={{ fontWeight: 500 }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copiado!" : label}
    </button>
  );
}

export default function ContributePage() {
  const { donations, isPending } = useDonations();

  const pixKey = donations?.pixKey || "(12) 98170-5757";
  const pixKeyType = donations?.pixKeyType || "phone";
  const pixRawKey =
    pixKeyType === "phone" || pixKeyType === "cnpj"
      ? pixKey.replace(/\D/g, "")
      : pixKey;
  const pixReceiverName = donations?.pixReceiverName || "Paroquia Sao Jose";
  const pixCity = donations?.pixReceiverCity || "Caraguatatuba";

  const pixPayload = generatePixPayload({
    key: pixRawKey,
    name: pixReceiverName,
    city: pixCity,
    txid: "***",
  });

  const getPixKeyTypeLabel = (type: string) => {
    switch (type) {
      case "phone":
        return "Telefone / Celular";
      case "cnpj":
        return "CNPJ";
      case "email":
        return "E-mail";
      case "random":
        return "Chave Aleatória";
      default:
        return "Telefone";
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#fbf6ee] overflow-hidden pt-8 pb-24 md:pb-36">
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="text-xs text-[#8c7b6c] mb-6 flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-[#2d261e] transition-colors">
              Início
            </Link>
            <span>&gt;</span>
            <span className="text-[#2d261e]">Quero Contribuir</span>
          </nav>

          {/* Page Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a6824b] uppercase tracking-widest mb-2">
              <Heart className="w-4 h-4" />
              <span>OBRAS E MISSÃO</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#18351E]">
              {donations?.title || "Contribua com a Paróquia São José"}
            </h1>
            <p className="text-sm md:text-base text-[#6b5c4d] mt-2">
              {donations?.description ||
                "Cada contribuição é um ato de fé e solidariedade, fortalecendo a missão da paróquia e o trabalho pastoral em nossa comunidade."}
            </p>
          </div>

          <div className="space-y-14">

          {/* Side-by-side Donation Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Card 1: Doação via PIX */}
            <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#D6A64A]/30 mb-6">
                  <div>
                    <span className="text-[#B8872E] text-xs font-bold uppercase tracking-[0.2em] block mb-1">
                      DOAÇÃO INSTANTÂNEA
                    </span>
                    <h2
                      className="text-2xl sm:text-3xl font-semibold text-[#18351E]"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      Contribuição via PIX
                    </h2>
                  </div>
                  <div className="size-11 rounded-2xl bg-[#ECD6BD]/30 border border-[#D6A64A]/50 flex items-center justify-center text-[#B8872E] shrink-0">
                    <QrCode className="size-6" />
                  </div>
                </div>

                {/* Chave Pix Box */}
                <div className="bg-[#fbf6ee] border border-[#D6A64A]/40 rounded-2xl p-5 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase font-semibold tracking-wider text-[#B8872E] mb-1">
                        Chave ({getPixKeyTypeLabel(pixKeyType)})
                      </p>
                      <p
                        className="text-[#18351E] text-2xl sm:text-3xl tracking-tight font-bold"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {pixKey}
                      </p>
                      <p className="text-xs text-[#5A463B] mt-1">
                        {donations?.pixReceiverName
                          ? `${donations.pixReceiverName} — ${donations?.pixReceiverCity || "Caraguatatuba"}`
                          : "Paróquia São José — Caraguatatuba"}
                      </p>
                    </div>
                    <CopyButton text={pixRawKey} label="Copiar chave" />
                  </div>
                </div>

                {/* QR Code & Copia e Cola */}
                <div className="flex flex-col sm:flex-row gap-5 items-center bg-[#fbf6ee] border border-[#D6A64A]/40 rounded-2xl p-5 mb-6">
                  <div className="shrink-0 bg-[#fbf5eb] border border-[#D6A64A]/50 rounded-xl p-3 shadow-2xs flex items-center justify-center">
                    <QRCodeSVG
                      value={pixPayload}
                      size={140}
                      level="M"
                      bgColor="#fbf5eb"
                      fgColor="#18351E"
                      className="size-32 sm:size-36 object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-3 flex-1 text-center sm:text-left">
                    <p className="text-[#5A463B] text-xs sm:text-sm leading-relaxed">
                      Abra o app do seu banco, escolha <strong>Pix → Pagar com QR Code</strong> e aponte a câmera, ou copie o código Pix abaixo.
                    </p>
                    <div>
                      <CopyButton
                        text={pixPayload}
                        label="Copiar Pix Copia e Cola"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Confirmation */}
              <div className="bg-[#ECD6BD]/20 border border-[#D6A64A]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
                <div>
                  <p className="text-xs font-bold text-[#18351E] uppercase tracking-wider">
                    Envio de Comprovante
                  </p>
                  <p className="text-xs text-[#5A463B]">
                    Confirme sua intenção ou dízimo pelo WhatsApp da paróquia.
                  </p>
                </div>
                <a
                  href={
                    donations?.receiptWhatsappUrl ||
                    (donations?.receiptWhatsapp
                      ? `https://wa.me/55${donations.receiptWhatsapp.replace(/\D/g, "")}`
                      : "https://wa.me/5512981705757")
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18351E] text-[#eeca94] text-xs sm:text-sm px-4 py-2 hover:bg-[#27442A] transition-colors shrink-0 font-medium"
                >
                  <PhoneIcon size={14} />
                  <span>{donations?.receiptWhatsapp || "(12) 98170-5757"}</span>
                </a>
              </div>
            </div>

            {/* Card 2: Transferência Bancária & Outras Formas */}
            <div className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#D6A64A]/30 mb-6">
                  <div>
                    <span className="text-[#B8872E] text-xs font-bold uppercase tracking-[0.2em] block mb-1">
                      TRANSFERÊNCIA BANCÁRIA
                    </span>
                    <h2
                      className="text-2xl sm:text-3xl font-semibold text-[#18351E]"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      Depósito & TED
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#18351E] bg-[#fbf6ee] border border-[#D6A64A]/40 rounded-xl px-3 py-1.5 inline-block shadow-2xs">
                      {donations?.bankName || "Santander"}
                    </span>
                  </div>
                </div>

                {/* Bank Account Details Grid */}
                <div className="bg-[#fbf6ee] border border-[#D6A64A]/40 rounded-2xl p-5 mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[#5A463B] text-xs mb-0.5 font-medium">Agência</p>
                      <p className="text-[#18351E] text-base font-bold font-mono">
                        {donations?.bankAgency || "4171"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#5A463B] text-xs mb-0.5 font-medium">
                        {donations?.bankAccountType || "Conta Corrente"}
                      </p>
                      <p className="text-[#18351E] text-base font-bold font-mono">
                        {donations?.bankAccount || "13002394-1"}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[#5A463B] text-xs mb-0.5 font-medium">CNPJ</p>
                      <p className="text-[#18351E] text-sm sm:text-base font-bold font-mono">
                        {donations?.bankCnpj || "03.167.725/0017-24"}
                      </p>
                    </div>
                  </div>

                  {donations?.bankBeneficiary && (
                    <div className="border-t border-[#D6A64A]/30 pt-3 mb-3">
                      <p className="text-xs text-[#5A463B]">
                        Favorecido:{" "}
                        <span className="font-semibold text-[#18351E]">
                          {donations.bankBeneficiary}
                        </span>
                      </p>
                    </div>
                  )}

                  <div>
                    <CopyButton
                      text={donations?.bankCnpj || "03.167.725/0017-24"}
                      label="Copiar CNPJ para transferência"
                    />
                  </div>
                </div>

                {/* Outras Formas de Contribuir */}
                <div className="mt-8">
                  <div className="mb-4">
                    <span className="text-[#B8872E] text-xs font-bold uppercase tracking-[0.2em] block mb-1">
                      OUTRAS FORMAS DE CONTRIBUIR
                    </span>
                    <h3
                      className="text-xl font-semibold text-[#18351E]"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      Presencialmente e Pastoral
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#fbf6ee] border border-[#D6A64A]/40 rounded-2xl p-4 shadow-2xs">
                      <h4
                        className="text-[#18351E] text-base font-semibold mb-1"
                        style={{ fontFamily: "Cormorant Garamond, serif" }}
                      >
                        Doação em Espécie
                      </h4>
                      <p className="text-[#5A463B] text-xs leading-relaxed">
                        Faça sua doação diretamente na secretaria da paróquia nos horários de atendimento.
                      </p>
                    </div>
                    <div className="bg-[#fbf6ee] border border-[#D6A64A]/40 rounded-2xl p-4 shadow-2xs">
                      <h4
                        className="text-[#18351E] text-base font-semibold mb-1"
                        style={{ fontFamily: "Cormorant Garamond, serif" }}
                      >
                        Apoio Pastoral
                      </h4>
                      <p className="text-[#5A463B] text-xs leading-relaxed">
                        Sua contribuição ajuda a manter a Paróquia São José e suas atividades de evangelização.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project photo + text (Horizontal Featured Card) */}
          <section className="bg-[#fbf5eb] border border-[#D6A64A]/40 rounded-3xl overflow-hidden shadow-sm p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 aspect-16/10 rounded-2xl overflow-hidden shadow-xs border border-[#D6A64A]/30">
                <img
                  src="/MacBookPro1412/9501870a6d2e000e824b7f82399914486cb30cfd.png"
                  alt="Centro Pastoral da Paróquia São José"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="lg:col-span-7 flex flex-col justify-center">
                <span className="text-[#B8872E] text-xs font-bold uppercase tracking-[0.25em] block mb-2">
                  OBRA EM DESTAQUE
                </span>
                <h3
                  className="text-2xl sm:text-3xl lg:text-4xl text-[#18351E] font-semibold mb-3"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {donations?.pastoralCenterTitle || "Centro Pastoral da Paróquia São José"}
                </h3>
                <p className="text-[#5A463B] text-sm sm:text-base mb-6 leading-relaxed">
                  {donations?.pastoralCenterDescription ||
                    "Com fé e dedicação, estamos dando vida ao Centro Pastoral da Paróquia São José — um espaço para evangelização, formação e convivência cristã. A boa fé de cada doador permitiu erguermos um local que acolhe a comunidade, promove encontros e fortalece a missão pastoral."}
                </p>
                <div>
                  <Link
                    href="/contato"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#18351E] text-[#eeca94] text-sm hover:bg-[#27442A] transition-colors font-medium shadow-xs"
                  >
                    <span>Falar com a secretaria</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Closing */}
          <div className="flex items-center justify-center gap-2 py-4 text-[#18351E]">
            <Heart size={16} className="fill-[#d6a64a] text-[#d6a64a]" />
            <span className="text-md font-medium">
              Que Deus abençoe a sua generosidade!
            </span>
          </div>
          </div>
        </div>
      </div>

      {/* Onda decorativa inferior */}
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
