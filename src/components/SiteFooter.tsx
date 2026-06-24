import { PhoneIcon } from "lucide-react";
import svgPaths from "../../public/Desktop5/svg-45x3npa3b6";
import Link from "next/link";
import { LogoMarkVerticalDark } from "./LogoMarkVerticalDark";
import { CrossIcon } from "./icons/CrossIcon";

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        clipRule="evenodd"
        d={svgPaths.p24541b00}
        fill="#D6A64A"
        fillRule="evenodd"
      />
      <path d={svgPaths.p3e93a340} fill="#D6A64A" />
      <path
        clipRule="evenodd"
        d={svgPaths.p4146700}
        fill="#D6A64A"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer
      id="contato"
      className="
        footer-section
        relative
        overflow-hidden
        bg-[#18351E]
        text-[#F8F3EC]
      "
    >
      <div
        className="
          max-w-220
          mx-auto
          px-6
          pt-10
          pb-14
        "
      >
        {/* Marca */}

        <div
          className="
            flex
            flex-col
            items-center
            text-center
            mb-20
          "
        >
          <div className="mb-4">
            <CrossIcon width={14} height={28} fill="#D6A64A" />
          </div>

          <Link href="/" className="flex items-center gap-3 shrink-0">
            <LogoMarkVerticalDark height={241.5} width={245.5} />
          </Link>
        </div>

        <div
          className="
            flex
            flex-col
            items-center
            md:items-start
            md:flex-row
            gap-10
            md:gap-12
            justify-between
          "
        >
          {/* Secretaria */}

          <div>
            <p
              className="
                text-[#D6A64A]
                uppercase
                tracking-widest
                text-sm
                mb-5
                text-center
                md:text-left
              "
            >
              Secretaria
            </p>

            <p
              className="
              text-[#F8F3EC]/80
              leading-relaxed
              text-center
              md:text-left
            "
            >
              Terça a sexta-feira:
              <br />
              9h às 12h e 14h às 17h40
              <br />
              <br />
              Sábado: 8h às 12h
            </p>
          </div>

          {/* Endereço */}

          <div>
            <p
              className="
                text-[#D6A64A]
                uppercase
                tracking-widest
                text-sm
                mb-5
                text-center
                md:text-left
              "
            >
              Endereço
            </p>

            <p
              className="
                text-[#F8F3EC]/80
                leading-relaxed
                text-center
                md:text-left
              "
            >
              R. Edson dos Santos, 30
              <br />
              Morro do Algodão
              <br />
              Caraguatatuba - SP, 11671-180
            </p>
          </div>

          {/* Redes */}

          <div>
            <p
              className="
                text-[#D6A64A]
                uppercase
                tracking-widest
                text-sm
                mb-5
                text-center
                md:text-left
              "
            >
              Redes Sociais
            </p>

            <div className="space-y-4 flex flex-col items-center md:items-start">
              <a
                href="#"
                className="
                  flex
                  items-center
                  gap-3
                  text-[#F8F3EC]/80
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
                  text-[#F8F3EC]/80
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

              <a
                href="#"
                className="
                  flex
                  items-center
                  gap-3
                  text-[#F8F3EC]/80
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
                  <PhoneIcon className="text-[#D6A64A]" size={14} />
                </span>
                (12) 98170-5757
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* bottom */}

      <div
        className="
          border-t
          border-[#D6A64A]/30
          py-5
          text-center
        "
      >
        <p
          className="
            text-[#F8F3EC]/50
            text-sm
          "
        >
          Copyright © 2026 Paróquia São José
        </p>
      </div>
    </footer>
  );
}
