import svgPaths from "../../public/Desktop5/svg-45x3npa3b6";

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        clipRule="evenodd"
        d={svgPaths.p39e9f800}
        fill="#F9F5F2"
        fillRule="evenodd"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        clipRule="evenodd"
        d={svgPaths.p24541b00}
        fill="#F9F5F2"
        fillRule="evenodd"
      />
      <path d={svgPaths.p3e93a340} fill="#F9F5F2" />
      <path
        clipRule="evenodd"
        d={svgPaths.p4146700}
        fill="#F9F5F2"
        fillRule="evenodd"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d={svgPaths.p1dc90a80} fill="#F9F5F2" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer id="contato" className="bg-[#4a2f24]">
      <div className="border-b border-[#533b31]">
        <div className="max-w-300 mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {/* Secretaria */}
            <div>
              <p
                className="text-[#f9f5f2] text-[11px] uppercase tracking-widest mb-4"
                style={{ fontWeight: 500 }}
              >
                Secretaria
              </p>
              <div
                className="space-y-2 text-[#f9f5f2]/80 text-[14px]"
                style={{ lineHeight: 1.7 }}
              >
                <p>Terça a sexta-feira:</p>
                <p>9h às 12h e 14h às 17h40</p>
                <p className="mt-2">Sábado: 8h às 12h</p>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <p
                className="text-[#f9f5f2] text-[11px] uppercase tracking-widest mb-4"
                style={{ fontWeight: 500 }}
              >
                Endereço
              </p>
              <p
                className="text-[#f9f5f2]/80 text-[14px]"
                style={{ lineHeight: 1.7 }}
              >
                R. Edson dos Santos, 30 - Morro do Algodão,
                <br />
                Caraguatatuba - SP, 11671-180
              </p>
            </div>

            {/* Redes Sociais */}
            <div>
              <p
                className="text-[#f9f5f2] text-[11px] uppercase tracking-widest mb-4"
                style={{ fontWeight: 500 }}
              >
                Redes Sociais
              </p>
              <div className="space-y-3">
                <a
                  href="https://www.facebook.com/parsaojose/?locale=pt_BR"
                  target="_blank"
                  className="flex items-center gap-2.5 text-[#f9f5f2]/80 hover:text-[#f9f5f2] text-[14px] transition-colors"
                >
                  <FacebookIcon />
                  <span>parsaojose</span>
                </a>
                <a
                  href="https://www.instagram.com/paroquiasaojosecaragua/"
                  target="_blank"
                  className="flex items-center gap-2.5 text-[#f9f5f2]/80 hover:text-[#f9f5f2] text-[14px] transition-colors"
                >
                  <InstagramIcon />
                  <span>paroquiasaojosecaragua</span>
                </a>
                <a
                  href="https://api.whatsapp.com/send?phone=5512981705757"
                  target="_blank"
                  className="flex items-center gap-2.5 text-[#f9f5f2]/80 hover:text-[#f9f5f2] text-[14px] transition-colors"
                >
                  <PhoneIcon />
                  <span>(12) 98170-5757</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#533b31]/50">
        <div className="max-w-300 mx-auto px-6 py-5">
          <p className="text-[#f9f5f2]/50 text-[13px] text-center">
            Copyright © 2026 Paróquia São José
          </p>
        </div>
      </div>
    </footer>
  );
}
