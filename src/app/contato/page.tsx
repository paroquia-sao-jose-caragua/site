"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { MapPin, Clock, Send, CheckCircle, PhoneIcon } from "lucide-react";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        clipRule="evenodd"
        d="M12 7a5 5 0 100 10A5 5 0 0012 7zm-3 5a3 3 0 116 0 3 3 0 01-6 0z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path d="M17.5 6.5a1 1 0 110 2 1 1 0 010-2z" fill="currentColor" />
      <path
        clipRule="evenodd"
        d="M3 8c0-2.761 2.239-5 5-5h8c2.761 0 5 2.239 5 5v8c0 2.761-2.239 5-5 5H8c-2.761 0-5-2.239-5-5V8zm5-3h8a3 3 0 013 3v8a3 3 0 01-3 3H8a3 3 0 01-3-3V8a3 3 0 013-3z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          data?.message ??
            "Não foi possível enviar sua mensagem. Tente novamente.",
        );
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível enviar sua mensagem. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="
      relative
      overflow-hidden
      bg-[#fbf4eb]
    "
    >
      <div
        className="
        mx-auto
        relative
        z-10
      "
      >
        {/* Page header */}
        <div className="relative bg-[#18351e] border-b border-[#d6b686]">
          <div className="flex flex-col items-start max-w-[1100px] mx-auto px-6 py-6">
            <div className="flex items-center justify-center gap-1 text-[#d6b686] text-sm mb-4 bg-[#1f3f26] px-3 py-1.5 rounded-full border border-[#eeca94]/20">
              <PhoneIcon size={16} fill="#d6b686" />
              <span>Contato</span>
            </div>
            <h1 className="text-[#fff8f0] text-3xl lg:text-4xl font-semibold">
              Entre em contato conosco
            </h1>
            <p
              className="
                mt-5
                text-[#f8f3ece6]
                text-lg
                max-w-3xl
              "
              style={{
                fontFamily: "Cormorant Garamond, serif",
              }}
            >
              Estamos à disposição para acolher suas dúvidas, intenções,
              sugestões e pedidos.
            </p>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto pt-12 pb-36 px-6 grid lg:grid-cols-[1.4fr_420px] gap-8 items-start">
          {/* Formulário */}

          <div
            className="
              bg-[#fbf4eb]
              border
              border-[#D6A64A]
              rounded-3xl
              p-8
              lg:p-10
            "
          >
            {submitted ? (
              <div
                className="
                bg-[#fbf4eb]
                text-center
              "
              >
                <div
                  className="
                    mx-auto
                    size-16
                    rounded-full
                    flex
                    items-center
                    justify-center
                  "
                >
                  <CheckCircle size={30} className="text-[#B8872E]" />
                </div>

                <h2
                  className="
                    text-[#18351E]
                    text-4xl
                    mb-3
                  "
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontWeight: 600,
                  }}
                >
                  Mensagem enviada
                </h2>

                <p className="text-[#5A463B]">
                  Obrigado pelo contato. Retornaremos em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div
                    className="
                      rounded-2xl
                      border
                      border-red-300
                      bg-red-50
                      px-4
                      py-3
                      text-red-700
                      text-sm
                    "
                  >
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#18351E] text-sm mb-2 font-medium">
                      Nome Completo
                    </label>

                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Seu nome"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[#D6A64A]/40
                        bg-[#fbf4eb]
                        px-4
                        py-3
                        text-[#18351E]
                        outline-none
                        focus:border-[#B8872E]
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-[#18351E] text-sm mb-2 font-medium">
                      E-mail
                    </label>

                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          email: e.target.value,
                        }))
                      }
                      placeholder="seu@email.com"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[#D6A64A]/40
                        bg-[#fbf4eb]
                        px-4
                        py-3
                        text-[#18351E]
                        outline-none
                        focus:border-[#B8872E]
                      "
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#18351E] text-sm mb-2 font-medium">
                    Assunto
                  </label>

                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="Assunto da mensagem"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#D6A64A]/40
                      bg-[#fbf4eb]
                      px-4
                      py-3
                      text-[#18351E]
                      outline-none
                      focus:border-[#B8872E]
                    "
                  />
                </div>

                <div>
                  <label className="block text-[#18351E] text-sm mb-2 font-medium">
                    Mensagem
                  </label>

                  <textarea
                    required
                    rows={8}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Escreva sua mensagem..."
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#D6A64A]/40
                      bg-[#fbf4eb]
                      px-4
                      py-3
                      text-[#18351E]
                      outline-none
                      resize-none
                      focus:border-[#B8872E]
                    "
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#18351E]
                    px-8
                    py-3
                    text-[#eeca94]
                    hover:bg-[#27442A]
                    transition-colors
                    disabled:opacity-60
                    w-full
                  "
                >
                  {loading ? (
                    <>
                      <div className="size-4 border-2 border-[#D6A64A]/30 border-t-[#D6A64A] rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}

          <div className="space-y-5">
            {/* WhatsApp */}

            <div
              className="
              bg-[#fbf4eb]
              border
              border-[#D6A64A]
              rounded-3xl
              p-6
            "
            >
              <h3
                className="
                    text-[#18351E]
                    text-xl
                    mb-3
                  "
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontWeight: 600,
                }}
              >
                Prefere falar pelo WhatsApp?
              </h3>

              <p className="text-[#5A463B] leading-relaxed">
                Atendimento mais rápido pela Secretaria Paroquial.
              </p>

              <a
                href="https://wa.me/5512981705757"
                target="_blank"
                rel="noopener noreferrer"
                className="
                mt-4
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#18351E]
                text-[#eeca94]
                py-3
                hover:bg-[#27442A]
                transition-colors
              "
              >
                <PhoneIcon className="text-[#eeca94]" size={16} />
                (12) 98170-5757
              </a>
            </div>

            {/* Endereço */}

            <div
              className="
              bg-[#fbf4eb]
              border
              border-[#D6A64A]
              rounded-3xl
              p-6
            "
            >
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#B8872E] mt-1 shrink-0" />

                <div>
                  <h3
                    className="
                    text-[#18351E]
                    text-xl
                    mb-3
                  "
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontWeight: 600,
                    }}
                  >
                    Endereço
                  </h3>

                  <p className="text-[#5A463B] leading-relaxed">
                    R. Edson dos Santos, 30
                    <br />
                    Morro do Algodão
                    <br />
                    Caraguatatuba - SP, 11671-180
                  </p>
                </div>
              </div>
            </div>

            {/* Horários */}

            <div
              className="
              bg-[#fbf4eb]
              border
              border-[#D6A64A]
              rounded-3xl
              p-6
            "
            >
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-[#B8872E] mt-1 shrink-0" />

                <div>
                  <h3
                    className="
                    text-[#18351E]
                    text-xl
                    mb-3
                  "
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontWeight: 600,
                    }}
                  >
                    Secretaria
                  </h3>

                  <p className="text-[#5A463B] leading-relaxed">
                    Terça a sexta-feira
                    <br />
                    9h às 12h e 14h às 17h40
                    <br />
                    <br />
                    Sábado: 8h às 12h
                  </p>
                </div>
              </div>
            </div>

            {/* Redes */}

            <div
              className="
              bg-[#fbf4eb]
              border
              border-[#D6A64A]
              rounded-3xl
              p-6
            "
            >
              <h3
                className="
                text-[#18351E]
                text-xl
                mb-4
              "
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontWeight: 600,
                }}
              >
                Redes Sociais
              </h3>

              <div className="space-y-3">
                <a
                  href="#"
                  className="
                  flex
                  items-center
                  gap-3
                  text-[#5a463b]
                "
                >
                  <span
                    className="
                    size-8
                    rounded-full
                    border
                    border-[#D6A64A]
                    flex
                    items-center
                    justify-center
                    text-[#D6A64A]
                    font-bold
                  "
                  >
                    f
                  </span>
                  parsaojose
                </a>

                <a
                  href="#"
                  className="
                  flex
                  items-center
                  gap-3
                  text-[#5a463b]
                "
                >
                  <span
                    className="
                    size-8
                    rounded-full
                    border
                    border-[#D6A64A]
                    flex
                    items-center
                    justify-center
                    text-[#D6A64A]
                  "
                  >
                    <InstagramIcon />
                  </span>
                  paroquiasaojosecaragua
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

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
