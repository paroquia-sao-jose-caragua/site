export function ParishSchema() {
  const parishSchema = {
    "@context": "https://schema.org",
    "@type": ["Church", "Organization", "Place"],

    name: "Paróquia São José",
    description:
      "Paróquia São José em Caraguatatuba - SP. Informações sobre missas, celebrações, eventos, sacramentos e atividades da comunidade.",

    url: "https://paroquiasaojosecaragua.org.br",

    areaServed: {
      "@type": "City",
      name: "Caraguatatuba",
      containedInPlace: {
        "@type": "State",
        name: "São Paulo",
      },
    },

    address: {
      "@type": "PostalAddress",
      streetAddress: "R. Edson dos Santos, 30 - Morro do Algodão",
      addressLocality: "Caraguatatuba",
      addressRegion: "SP",
      postalCode: "11671-180",
      addressCountry: "BR",
    },

    image: "https://paroquiasaojosecaragua.org.br/og-image.jpg",

    sameAs: [
      "https://www.instagram.com/paroquiasaojosecaragua",
      "https://www.facebook.com/parsaojose/?locale=pt_BR",
    ],
  };

  return (
    <script
      id="parish-schema"
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(parishSchema),
      }}
    />
  );
}
