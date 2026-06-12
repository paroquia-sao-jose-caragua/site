import { useState } from "react";
import { Link } from "react-router";
import { Copy, Check, Heart, ChevronRight } from "lucide-react";
import svgPaths from "../../imports/MacBookPro1412/svg-3c63l3s3dy";
import imgQrCode from "../../imports/MacBookPro1412/0387079cf701d07a2fd68e5f432a1d50030fb66c.png";
import imgCentro from "../../imports/MacBookPro1412/9501870a6d2e000e824b7f82399914486cb30cfd.png";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d={svgPaths.p179ae280} fill="currentColor" />
    </svg>
  );
}

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
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] transition-all",
        copied
          ? "bg-green-50 border-green-300 text-green-700"
          : "border-[#dcc2b5] text-[#7b4f37] hover:bg-[#f9f5f2]",
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
    <div className="min-h-screen bg-[#fafafa]">

      {/* Page hero — warm tone */}
      <div className="bg-[#4a2f24]">
        <div className="max-w-[860px] mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#f9f5f2] text-[12px] px-3 py-1.5 rounded-full mb-4" style={{ fontWeight: 500 }}>
            <Heart size={12} className="fill-[#faba45] text-[#faba45]" />
            Obras e Missão
          </div>
          <h1 className="text-[#f9f5f2] text-[30px] md:text-[36px] mb-3" style={{ fontWeight: 600, lineHeight: 1.3 }}>
            Contribua com a construção do nosso Centro Pastoral
          </h1>
          <p className="text-[#dcc2b5] text-[16px] max-w-[540px] mx-auto" style={{ lineHeight: 1.7 }}>
            Cada doação nos aproxima da conclusão deste espaço que servirá a toda a comunidade.
          </p>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-6 py-12 space-y-10">

        {/* ── PIX Section ─────────────────────────────────────── */}
        <section>
          <h2 className="text-[#1a1a1a] text-[20px] mb-6" style={{ fontWeight: 600 }}>
            Faça sua doação via PIX
          </h2>

          <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-sm">

            {/* Phone PIX key — primary */}
            <div className="p-6 border-b border-[#f0f0f0]">
              <p className="text-[11px] text-[#7b4f37] uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>
                Chave PIX — Telefone
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-[#6b7280] text-[13px] mb-1">Chave</p>
                  <p className="text-[#1a1a1a] text-[28px] tracking-tight" style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    (12) 98170-5757
                  </p>
                  <p className="text-[#9ca3af] text-[13px] mt-1">Paróquia São José — Caraguatatuba</p>
                </div>
                <CopyButton text="12981705757" label="Copiar chave" />
              </div>
            </div>

            {/* Bank details */}
            <div className="p-6 border-b border-[#f0f0f0]">
              <p className="text-[11px] text-[#7b4f37] uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>
                Dados Bancários — Santander
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-[#6b7280] text-[12px] mb-0.5">CNPJ</p>
                  <p className="text-[#1a1a1a] text-[15px]" style={{ fontWeight: 600 }}>03.167.725/0005-90</p>
                </div>
                <div>
                  <p className="text-[#6b7280] text-[12px] mb-0.5">Agência</p>
                  <p className="text-[#1a1a1a] text-[15px]" style={{ fontWeight: 600 }}>4171</p>
                </div>
                <div>
                  <p className="text-[#6b7280] text-[12px] mb-0.5">Conta Corrente</p>
                  <p className="text-[#1a1a1a] text-[15px]" style={{ fontWeight: 600 }}>13002394-1</p>
                </div>
              </div>
              <CopyButton text="03.167.725/0005-90" label="Copiar CNPJ" />
            </div>

            {/* QR Code */}
            <div className="p-6">
              <p className="text-[11px] text-[#7b4f37] uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>
                QR Code PIX
              </p>
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="shrink-0 bg-white border border-[#e5e7eb] rounded-xl p-3">
                  <img
                    src={imgQrCode}
                    alt="QR Code PIX Paróquia São José"
                    className="w-[180px] h-[180px] object-contain"
                  />
                </div>
                <div className="flex flex-col gap-4 justify-center">
                  <p className="text-[#2b2b2b] text-[14px]" style={{ lineHeight: 1.7 }}>
                    Abra o app do seu banco, vá em <strong>Pix → Ler QR Code</strong> e aponte a câmera para o código ao lado.
                  </p>
                  <div className="bg-[#f9f5f2] border border-[#dcc2b5]/60 rounded-xl p-4">
                    <p className="text-[#7b4f37] text-[13px] mb-2" style={{ fontWeight: 600 }}>
                      Envie o comprovante pelo WhatsApp
                    </p>
                    <a
                      href="https://wa.me/5512981705757"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#00c760] hover:bg-[#00b055] text-white text-[13px] px-4 py-2 rounded-lg transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      <WhatsAppIcon size={15} />
                      (12) 98170-5757
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Other ways ─────────────────────────────────────── */}
        <section>
          <h2 className="text-[#1a1a1a] text-[18px] mb-4" style={{ fontWeight: 600 }}>
            Outras formas de contribuir
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
              <p className="text-[#1a1a1a] text-[14px] mb-1" style={{ fontWeight: 600 }}>Doação em Espécie</p>
              <p className="text-[#6b7280] text-[13px]" style={{ lineHeight: 1.6 }}>
                Faça sua doação diretamente na secretaria da paróquia nos horários de atendimento.
              </p>
            </div>
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-sm">
              <p className="text-[#1a1a1a] text-[14px] mb-1" style={{ fontWeight: 600 }}>Materiais de Construção</p>
              <p className="text-[#6b7280] text-[13px]" style={{ lineHeight: 1.6 }}>
                Aceitamos tijolos, cimento, areia e outros materiais. Entre em contato para mais informações.
              </p>
            </div>
          </div>
        </section>

        {/* ── Project photo + text ───────────────────────────── */}
        <section className="border-t border-[#f0f0f0] pt-10">
          <div className="rounded-2xl overflow-hidden shadow-sm aspect-[16/7] mb-6">
            <img
              src={imgCentro}
              alt="Centro Pastoral da Paróquia São José"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-[#6b7280] text-[15px] mb-4" style={{ lineHeight: 1.8 }}>
            Com fé e dedicação, estamos dando vida ao Centro Pastoral da Paróquia São José — um espaço para
            evangelização, formação e convivência cristã. Cada doação é um passo importante nessa missão de acolher,
            formar e servir.
          </p>
          <Link
            to="/contato"
            className="inline-flex items-center gap-1 text-[#7b4f37] text-[14px] hover:text-[#4a2f24] transition-colors"
            style={{ fontWeight: 500 }}
          >
            Falar com a secretaria
            <ChevronRight size={15} />
          </Link>
        </section>

        {/* Closing */}
        <div className="flex items-center justify-center gap-2 py-4 text-[#7b4f37]">
          <Heart size={14} className="fill-[#7b4f37]" />
          <span className="text-[13px]" style={{ fontWeight: 500 }}>
            Que Deus abençoe a sua generosidade!
          </span>
        </div>
      </div>
    </div>
  );
}
