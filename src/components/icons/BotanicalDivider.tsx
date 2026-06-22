import { SVGProps } from "react";

export const BotanicalDivider = (props: SVGProps<SVGSVGElement>) => {
  // A cor exata extraída da imagem original
  const exactColor = "#CD903F";

  return (
    <svg
      viewBox="0 0 240 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Linha central */}
      <line
        x1="10"
        y1="40"
        x2="230"
        y2="40"
        stroke={exactColor}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Ramo e Baga - Superior Esquerdo */}
      <path
        d="M 85 40 Q 75 25 60 22"
        fill="none"
        stroke={exactColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="60" cy="22" r="3.5" fill={exactColor} />

      {/* Ramo e Baga - Inferior Esquerdo */}
      <path
        d="M 95 40 Q 80 55 65 55"
        fill="none"
        stroke={exactColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="65" cy="55" r="4" fill={exactColor} />

      {/* Folha - Superior Esquerda */}
      <path
        d="M 105 40 C 95 25 105 10 115 10 C 115 20 110 35 105 40"
        fill={exactColor}
      />

      {/* Folha - Inferior Esquerda */}
      <path
        d="M 115 40 C 115 55 105 70 95 70 C 95 60 105 45 115 40"
        fill={exactColor}
      />

      {/* Folha - Superior Direita */}
      <path
        d="M 125 40 C 130 20 145 10 150 15 C 145 25 135 35 125 40"
        fill={exactColor}
      />

      {/* Ramo e Baga - Inferior Direito */}
      <path
        d="M 135 40 Q 145 55 160 55"
        fill="none"
        stroke={exactColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="160" cy="55" r="3.5" fill={exactColor} />

      {/* Ramo Menor e Baga - Superior Direito */}
      <path
        d="M 145 40 Q 160 25 175 30"
        fill="none"
        stroke={exactColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="175" cy="30" r="3" fill={exactColor} />

      {/* Folha Menor - Inferior Direita */}
      <path
        d="M 150 40 C 155 50 165 60 170 55 C 165 50 155 45 150 40"
        fill={exactColor}
      />
    </svg>
  );
};
