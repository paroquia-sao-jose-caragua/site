import Link from "next/link";
import { BotanicalDivider } from "./icons/BotanicalDivider";

export function CentroPastoralSection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#18351E]
        py-24
      "
    >
      {/* detalhe inferior */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          h-1
          bg-[#D6A64A]
        "
      />

      <div
        className="
          max-w-320
          mx-auto
          px-6
          relative
          z-10
        "
      >
        <div
          className="
            flex
            flex-col
            lg:flex-row
            gap-14
            items-center
          "
        >
          {/* Texto */}

          <div
            className="
              flex-1
              text-[#FBF8F3]
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                mb-5
              "
            >
              <BotanicalDivider height={30} width={45} />

              <p
                className="
                  text-[#D6A64A]
                  uppercase
                  tracking-[0.35em]
                  text-sm
                "
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                }}
              >
                Obras e Missão
              </p>

              <BotanicalDivider height={30} width={45} />
            </div>

            <h2
              className="
                text-3xl lg:text-4xl
                font-semibold
                leading-tight
                mb-6
                text-[#fff8f0]
              "
              style={{
                fontFamily: "Cormorant Garamond, serif",
              }}
            >
              Um novo espaço para nossa comunidade
            </h2>

            <p
              className="
                text-[#F8F3EC]/90
                text-lg
                leading-relaxed
                mb-6
              "
              style={{
                fontFamily: "Cormorant Garamond, serif",
              }}
            >
              O Centro Pastoral da Paróquia São José nasce como um espaço de
              formação, acolhimento e encontro para fortalecer nossa caminhada
              de fé.
            </p>

            {/* data */}

            <div
              className="
                inline-flex
                items-center
                gap-5
                border
                border-[#D6A64A]
                rounded-2xl
                px-6
                py-4
                mb-8
              "
            >
              <span
                className="
                  text-[#D6A64A]
                  text-3xl
                "
              >
                ✦
              </span>

              <div>
                <p
                  className="
                    text-[#D6A64A]
                    uppercase
                    tracking-widest
                    text-sm
                  "
                >
                  Inauguração
                </p>

                <p
                  className="
                    text-[#FBF8F3]
                    text-2xl
                  "
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                  }}
                >
                  5 de Julho às 9h30
                </p>
              </div>
            </div>

            <p
              className="
                text-[#F8F3EC]/80
                leading-relaxed
                mb-8
              "
            >
              Após essa conquista, sua contribuição ajuda a manter esse espaço
              vivo, apoiando as formações pastorais, catequeses e encontros da
              nossa Igreja.
            </p>

            <Link
              href="/quero-contribuir"
              className="
                inline-flex
                items-center
                justify-center
                bg-[#D6A64A]
                hover:bg-[#c79535]
                text-[#18351E]
                px-8
                py-3
                rounded-xl
                transition
                shadow-lg
              "
              style={{
                fontWeight: 600,
              }}
            >
              Quero Contribuir
            </Link>
          </div>

          {/* Imagem */}

          <div
            className="
              w-full
              lg:w-[45%]
            "
          >
            <div
              className="
                relative
                rounded-3xl
                overflow-hidden
                border
                border-[#D6A64A]
                shadow-2xl
                aspect-[4/3]
              "
            >
              <img
                src="/Desktop5/9501870a6d2e000e824b7f82399914486cb30cfd.png"
                alt="Centro Pastoral da Paróquia São José"
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                "
              />

              {/* overlay */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#18351E]/60
                  to-transparent
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
