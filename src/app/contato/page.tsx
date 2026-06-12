import { useState } from "react";
import { MapPin, Clock, Send, CheckCircle } from "lucide-react";
import svgPaths from "../../imports/MacBookPro1412/svg-3c63l3s3dy";

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d={svgPaths.p179ae280} fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path clipRule="evenodd" d="M12 7a5 5 0 100 10A5 5 0 0012 7zm-3 5a3 3 0 116 0 3 3 0 01-6 0z" fill="currentColor" fillRule="evenodd" />
      <path d="M17.5 6.5a1 1 0 110 2 1 1 0 010-2z" fill="currentColor" />
      <path clipRule="evenodd" d="M3 8c0-2.761 2.239-5 5-5h8c2.761 0 5 2.239 5 5v8c0 2.761-2.239 5-5 5H8c-2.761 0-5-2.239-5-5V8zm5-3h8a3 3 0 013 3v8a3 3 0 01-3 3H8a3 3 0 01-3-3V8a3 3 0 013-3z" fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Page header */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-[1100px] mx-auto px-6 py-10">
          <p className="text-[#4a2f24] text-[11px] uppercase tracking-widest mb-2" style={{ fontWeight: 500 }}>
            Contato
          </p>
          <h1 className="text-[#1a1a1a] text-[30px]" style={{ fontWeight: 600, lineHeight: 1.3 }}>
            Entre em contato conosco
          </h1>
          <p className="text-[#6b7280] text-[16px] mt-2">
            Estamos aqui para ajudar. Envie sua mensagem ou fale diretamente pelo WhatsApp.
          </p>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

          {/* Contact form */}
          <div>
            {submitted ? (
              <div className="bg-white border border-[#dcc2b5]/50 rounded-2xl p-10 shadow-sm flex flex-col items-center text-center">
                <div className="size-16 rounded-full bg-[#f9f5f2] flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-[#7b4f37]" />
                </div>
                <h2 className="text-[#1a1a1a] text-[22px] mb-2" style={{ fontWeight: 600 }}>
                  Mensagem enviada!
                </h2>
                <p className="text-[#6b7280] text-[15px]" style={{ lineHeight: 1.7 }}>
                  Obrigado por entrar em contato. Retornaremos em breve.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-6 text-[#7b4f37] text-[14px] hover:text-[#4a2f24] transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-[#dcc2b5]/50 rounded-2xl p-8 shadow-sm space-y-5"
              >
                <h2 className="text-[#1a1a1a] text-[18px] mb-2" style={{ fontWeight: 600 }}>
                  Envie uma mensagem
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>
                      Nome completo
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Seu nome"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-[14px] text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#7b4f37] focus:ring-2 focus:ring-[#7b4f37]/15 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-[14px] text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#7b4f37] focus:ring-2 focus:ring-[#7b4f37]/15 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>
                    Assunto
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="Assunto da mensagem"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-[14px] text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#7b4f37] focus:ring-2 focus:ring-[#7b4f37]/15 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] text-[#374151] mb-1.5" style={{ fontWeight: 500 }}>
                    Mensagem
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Escreva sua mensagem..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-[14px] text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#7b4f37] focus:ring-2 focus:ring-[#7b4f37]/15 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#4a2f24] hover:bg-[#3d2318] disabled:opacity-70 text-[#f9f5f2] text-[15px] py-3 rounded-xl transition-colors shadow-sm"
                  style={{ fontWeight: 500 }}
                >
                  {loading ? (
                    <>
                      <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <div className="space-y-4">

            {/* WhatsApp CTA */}
            <div className="bg-white border border-[#dcc2b5]/50 rounded-2xl p-6 shadow-sm">
              <p className="text-[#1a1a1a] text-[15px] mb-1" style={{ fontWeight: 600 }}>
                Prefere falar pelo WhatsApp?
              </p>
              <p className="text-[#6b7280] text-[13px] mb-4">
                Atendimento mais rápido pela Secretaria Paroquial.
              </p>
              <a
                href="https://wa.me/5512981705757"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 bg-[#00c760] hover:bg-[#00b055] text-white text-[15px] py-3 rounded-xl transition-colors shadow-sm"
                style={{ fontWeight: 500 }}
              >
                <WhatsAppIcon size={18} />
                (12) 98170-5757
              </a>
            </div>

            {/* Address */}
            <div className="bg-white border border-[#dcc2b5]/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="size-8 rounded-lg bg-[#f9f5f2] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={16} className="text-[#7b4f37]" />
                </div>
                <div>
                  <p className="text-[#1a1a1a] text-[14px] mb-1" style={{ fontWeight: 600 }}>Endereço</p>
                  <p className="text-[#6b7280] text-[13px]" style={{ lineHeight: 1.6 }}>
                    R. Edson dos Santos, 30<br />
                    Morro do Algodão<br />
                    Caraguatatuba - SP, 11671-180
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white border border-[#dcc2b5]/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-[#f9f5f2] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={16} className="text-[#7b4f37]" />
                </div>
                <div>
                  <p className="text-[#1a1a1a] text-[14px] mb-2" style={{ fontWeight: 600 }}>Horário da Secretaria</p>
                  <div className="text-[#6b7280] text-[13px] space-y-1" style={{ lineHeight: 1.6 }}>
                    <p>Terça a sexta-feira:</p>
                    <p>9h às 12h e 14h às 18h</p>
                    <p className="mt-1">Sábado: 8h às 12h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="bg-white border border-[#dcc2b5]/50 rounded-2xl p-6 shadow-sm">
              <p className="text-[#1a1a1a] text-[14px] mb-3" style={{ fontWeight: 600 }}>Redes Sociais</p>
              <div className="space-y-2.5">
                <a
                  href="#"
                  className="flex items-center gap-2.5 text-[#6b7280] hover:text-[#4a2f24] text-[13px] transition-colors"
                >
                  <span className="size-7 rounded-lg bg-[#f9f5f2] flex items-center justify-center">
                    <FacebookIcon />
                  </span>
                  parsaojose
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2.5 text-[#6b7280] hover:text-[#4a2f24] text-[13px] transition-colors"
                >
                  <span className="size-7 rounded-lg bg-[#f9f5f2] flex items-center justify-center">
                    <InstagramIcon />
                  </span>
                  paroquiasaojosecaragua
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
