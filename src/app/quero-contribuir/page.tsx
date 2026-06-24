"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Heart,
  ChevronRight,
  HeartIcon,
  PhoneIcon,
} from "lucide-react";
import svgPaths from "../../../public/MacBookPro1412/svg-3c63l3s3dy";

import Link from "next/link";

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
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-md transition-all",
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
  return (
    <section className="relative overflow-hidden bg-[#fbf4eb]">
      <div className="relative z-10">
        {/* Page header */}
        <div className="relative bg-[#18351e] border-b border-[#d6b686]">
          <div className="flex flex-col items-center justify-center max-w-215 mx-auto px-6 py-16">
            <div className="flex items-center justify-center gap-1 text-[#d6b686] text-sm mb-4 bg-[#1f3f26] px-3 py-1.5 rounded-full border border-[#eeca94]/20">
              <HeartIcon size={14} fill="#d6b686" />
              <span>Obras e Missão</span>
            </div>
            <h1 className="max-w-150 text-[#fff8f0] text-3xl lg:text-4xl font-semibold text-center">
              Contribua com as obras e missões da Paróquia São José
            </h1>
            <p
              className="mt-5 text-[#f8f3ece6] text-lg max-w-3xl text-center"
              style={{
                fontFamily: "Cormorant Garamond, serif",
              }}
            >
              Cada contribuição é um ato de fé e solidariedade, fortalecendo a
              missão da paróquia e o trabalho pastoral em nossa comunidade.
            </p>
          </div>
        </div>

        <div className="max-w-215 mx-auto px-6 pt-12 pb-36 space-y-10">
          {/* PIX Section */}
          <section>
            <h2
              className="text-[#18351E] text-3xl mb-6"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: 600,
              }}
            >
              Faça sua doação via PIX
            </h2>

            <div className="bg-[#fbf4eb] border border-[#D6A64A] rounded-3xl overflow-hidden">
              {/* Phone PIX key */}
              <div className="p-6 border-b border-[#D6A64A]/40">
                <p className="text-sm text-[#18351E] uppercase tracking-widest mb-4 font-semibold">
                  Chave PIX — Telefone
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-[#5A463B] text-[13px] mb-1">Chave</p>
                    <p
                      className="text-[#18351E] text-[28px] tracking-tight"
                      style={{
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      (12) 98170-5757
                    </p>
                    <p className="text-[#5A463B]/80 text-[13px] mt-1">
                      Paróquia São José — Caraguatatuba
                    </p>
                  </div>
                  <CopyButton text="12981705757" label="Copiar chave" />
                </div>
              </div>

              {/* Bank details */}
              <div className="p-6 border-b border-[#D6A64A]/40">
                <p className="text-sm text-[#18351E] uppercase tracking-widest mb-4 font-semibold">
                  Dados Bancários — Santander
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-[#5A463B] text-[12px] mb-0.5">CNPJ</p>
                    <p className="text-[#18351E] text-[15px] font-semibold">
                      03.167.725/0017-24
                    </p>
                  </div>
                  <div>
                    <p className="text-[#5A463B] text-[12px] mb-0.5">Agência</p>
                    <p className="text-[#18351E] text-[15px] font-semibold">
                      4171
                    </p>
                  </div>
                  <div>
                    <p className="text-[#5A463B] text-[12px] mb-0.5">
                      Conta Corrente
                    </p>
                    <p className="text-[#18351E] text-[15px] font-semibold">
                      13002394-1
                    </p>
                  </div>
                </div>
                <CopyButton text="03.167.725/0017-24" label="Copiar CNPJ" />
              </div>

              {/* QR Code */}
              <div className="p-6">
                <p className="text-sm text-[#18351E] uppercase tracking-widest mb-4 font-semibold">
                  QR Code PIX
                </p>
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="shrink-0 bg-[#fbf4eb] border border-[#D6A64A]/60 rounded-2xl p-3">
                    <img
                      src="/qr-code.svg"
                      alt="QR Code PIX Paróquia São José"
                      className="w-45 h-45 object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-4 justify-center">
                    <p className="text-[#5A463B] text-[14px] leading-relaxed">
                      Abra o app do seu banco, vá em{" "}
                      <strong>Pix → Ler QR Code</strong> e aponte a câmera para
                      o código ao lado.
                    </p>
                    <div className="bg-[#ECD6BD]/20 border border-[#D6A64A]/50 rounded-2xl p-4">
                      <p className="text-[#18351E] text-md mb-2 font-semibold">
                        Envie o comprovante pelo WhatsApp
                      </p>
                      <a
                        href="https://wa.me/5512981705757"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#18351E] text-[#eeca94] text-md px-4 py-2 hover:bg-[#27442A] transition-colors"
                        style={{ fontWeight: 500 }}
                      >
                        <PhoneIcon size={15} />
                        (12) 98170-5757
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Other ways */}
          <section>
            <h2
              className="text-[#18351E] text-2xl mb-4"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: 600,
              }}
            >
              Outras formas de contribuir
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#fbf4eb] border border-[#D6A64A] rounded-3xl p-5">
                <h3
                  className="text-[#18351E] text-xl mb-2"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontWeight: 600,
                  }}
                >
                  Doação em Espécie
                </h3>
                <p className="text-[#5A463B] text-[14px] leading-relaxed">
                  Faça sua doação diretamente na secretaria da paróquia nos
                  horários de atendimento.
                </p>
              </div>
              <div className="bg-[#fbf4eb] border border-[#D6A64A] rounded-3xl p-5">
                <h3
                  className="text-[#18351E] text-xl mb-2"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontWeight: 600,
                  }}
                >
                  Apoio às Atividades Pastorais
                </h3>
                <p className="text-[#5A463B] text-[14px] leading-relaxed">
                  Sua contribuição ajuda a manter a Paróquia São José e suas
                  atividades de evangelização.
                </p>
              </div>
            </div>
          </section>

          {/* Project photo + text */}
          <section className="border-t border-[#D6A64A]/40 pt-10">
            <div className="bg-[#fbf4eb] border border-[#D6A64A] rounded-3xl overflow-hidden mb-6">
              <div className="aspect-16/7">
                <img
                  src="/MacBookPro1412/9501870a6d2e000e824b7f82399914486cb30cfd.png"
                  alt="Centro Pastoral da Paróquia São José"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p className="text-[#5A463B] text-[15px] mb-4 leading-relaxed">
              Com fé e dedicação, estamos dando vida ao Centro Pastoral da
              Paróquia São José — um espaço para evangelização, formação e
              convivência cristã. A boa fé de cada doador permitiu erguermos um
              local que acolhe a comunidade, promove encontros e fortalece a
              missão pastoral.
            </p>
            <Link
              href="/contato"
              className="inline-flex items-center gap-1 text-[#18351E] text-md hover:text-[#27442A] transition-colors font-medium"
            >
              Falar com a secretaria
              <ChevronRight size={15} />
            </Link>
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
