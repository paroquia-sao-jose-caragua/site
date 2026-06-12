import { useState } from "react";
import { X } from "lucide-react";

import imgEllipse6 from "../../imports/Desktop5/cbfee9095d0b7216d141eba05232f2e192b01bc2.png";
import imgEllipse7 from "../../imports/Desktop5/2c639083669db26e28970c07d7940eb6016061d7.png";
import imgEllipse8 from "../../imports/Desktop5/f5d4c9341b05a3663e03b0433e3c3f2de529be86.png";
import imgEllipse9 from "../../imports/Desktop5/ae2df067426c94caa1cca45ef44e6b134da6cbe4.png";

interface ClergyMember {
  img: string;
  role: string;
  name: string;
  bio: string;
}

const clergy: ClergyMember[] = [
  {
    img: imgEllipse6,
    role: "Pároco",
    name: "Padre Altair Santos",
    bio: "O Padre Altair Santos é natural de São Paulo e foi ordenado presbítero pela Diocese de Caraguatatuba em 2003. Com mais de duas décadas de ministério sacerdotal, dedicou sua vida pastoral ao serviço das comunidades do litoral norte paulista. Chegou à Paróquia São José em 2018, onde desde então conduz com dedicação e proximidade as celebrações, a formação dos fiéis e as obras sociais da paróquia. É conhecido pela sua homilia acolhedora, pelo compromisso com a catequese e pelo cuidado especial com os mais vulneráveis. Coordena também o Carnê Solidário para a construção do Centro Pastoral, projeto que considera sua maior missão na comunidade.",
  },
  {
    img: imgEllipse7,
    role: "Diácono Permanente",
    name: "Valter de Almeida",
    bio: "Valter de Almeida nasceu em Caraguatatuba e sempre foi figura ativa na vida paroquial antes mesmo de receber o sacramento da Ordem. Ordenado Diácono Permanente pelo Bispo Diocesano em 2015, une sua vida familiar e profissional ao serviço da Igreja. Ministra a Palavra, auxilia nas celebrações eucarísticas e é responsável pela pastoral da caridade na Paróquia São José. Tem papel fundamental na visita aos enfermos e idosos das comunidades, levando a Eucaristia e o conforto espiritual a quem não pode comparecer às missas. Sua presença discreta e generosa é referência de fé encarnada no cotidiano.",
  },
  {
    img: imgEllipse8,
    role: "Bispo Diocesano",
    name: "Dom José Carlos Brandão Cabral",
    bio: "Dom José Carlos Brandão Cabral é o pastor da Diocese de Caraguatatuba, criada em 2006 pelo Papa Bento XVI. Natural de Minas Gerais, foi ordenado sacerdote em 1985 e bispo em 2007, sendo nomeado para liderar a jovem diocese litorânea desde a sua fundação. Sob sua liderança, a diocese expandiu suas paróquias, investiu na formação do clero e dos leigos e fortaleceu a presença da Igreja nas comunidades mais afastadas do litoral norte de São Paulo. É reconhecido pelo estilo pastoral próximo, pela atenção às questões sociais e pelo incentivo à participação dos jovens na vida eclesial.",
  },
  {
    img: imgEllipse9,
    role: "Sumo Pontífice",
    name: "Papa Leão XIV",
    bio: "O Papa Leão XIV, nascido Robert Francis Prevost em Chicago, Estados Unidos, em 1955, é o 267.º Bispo de Roma e líder da Igreja Católica Apostólica Romana. Membro da Ordem dos Agostinianos, foi missionário por muitos anos no Peru, onde exerceu o episcopado com grande zelo pastoral. Eleito pelo Colégio de Cardeais em maio de 2025, escolheu o nome Leão XIV em referência ao grande Papa Leão XIII, autor da encíclica Rerum Novarum. Seu pontificado é marcado pelo diálogo com o mundo moderno, pelo cuidado com os pobres e pela unidade da Igreja em tempos de profundas transformações sociais e culturais.",
  },
];

interface CleryModalProps {
  member: ClergyMember;
  onClose: () => void;
}

function CleroModal({ member, onClose }: CleryModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden max-h-[90vh] flex flex-col">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 size-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-[#4a2f24] transition-colors"
          aria-label="Fechar"
        >
          <X size={15} />
        </button>

        {/* Content — scrollable */}
        <div className="p-6 pt-8 overflow-y-auto">
          {/* Circular photo + role + name */}
          <div className="flex flex-col items-center text-center mb-5">
            <img
              src={member.img}
              alt={member.name}
              className="size-24 rounded-full object-cover object-top ring-4 ring-[#dcc2b5] mb-4"
            />
            <p className="text-[#a45d00] text-[11px] uppercase tracking-widest mb-1" style={{ fontWeight: 600 }}>
              {member.role}
            </p>
            <h2 className="text-[#1a1a1a] text-[18px]" style={{ fontWeight: 700, lineHeight: 1.3 }}>
              {member.name}
            </h2>
          </div>

          {/* Divider */}
          <div className="w-10 h-0.5 bg-[#dcc2b5] rounded-full mx-auto mb-5" />

          {/* Bio */}
          <p className="text-[#4b5563] text-[14px]" style={{ lineHeight: 1.8 }}>
            {member.bio}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CleroSection() {
  const [selected, setSelected] = useState<ClergyMember | null>(null);

  return (
    <section className="py-20 bg-[#f9f5f2]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-10">
          <p className="text-[#4a2f24] text-[11px] uppercase tracking-widest mb-1" style={{ fontWeight: 500 }}>
            Clero
          </p>
          <h2 className="text-[#4a2f24] text-[26px]" style={{ fontWeight: 600, lineHeight: 1.3 }}>
            Servos da Igreja
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {clergy.map((person, i) => (
            <button
              key={i}
              onClick={() => setSelected(person)}
              className="flex flex-col items-center gap-4 group focus:outline-none"
            >
              <div className="relative size-[140px] md:size-[160px] shrink-0">
                <img
                  src={person.img}
                  alt={person.name}
                  className="size-full object-cover object-top rounded-full ring-4 ring-[#dcc2b5] group-hover:ring-[#7b4f37] group-hover:scale-[1.03] transition-all duration-300"
                />
              </div>
              <div className="text-center">
                <p className="text-[#a45d00] text-[11px] uppercase tracking-wide mb-0.5" style={{ fontWeight: 600 }}>
                  {person.role}
                </p>
                <p className="text-[#7b4f37] text-[15px] group-hover:text-[#4a2f24] transition-colors" style={{ fontWeight: 600, lineHeight: 1.4 }}>
                  {person.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <CleroModal member={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
