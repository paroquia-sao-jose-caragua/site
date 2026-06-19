import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function CentroPastoralSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-300 mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 items-center">
          {/* Text */}
          <div className="flex-1 min-w-0">
            <p
              className="text-[#4a2f24] text-[11px] uppercase tracking-widest mb-1"
              style={{ fontWeight: 500 }}
            >
              Obras e Missão
            </p>
            <h2
              className="text-[#4a2f24] text-[26px] mb-5"
              style={{ fontWeight: 600, lineHeight: 1.35 }}
            >
              Contribua com a construção do nosso Centro Pastoral
            </h2>

            <div
              className="text-[#2b2b2b]/80 text-[16px] space-y-4"
              style={{ lineHeight: 1.7 }}
            >
              <p>
                Com fé, dedicação e o apoio da nossa comunidade, estamos dando
                vida ao Centro Pastoral da Paróquia São José — um espaço que
                será referência para a evangelização, formação e convivência
                cristã.
              </p>
              <p>
                Você pode fazer parte dessa obra por meio do{" "}
                <strong className="text-[#4a2f24]">Carnê Solidário</strong>,
                contribuindo a partir de R$ 30 mensais durante 12 meses. Para
                participar, retire seu carnê na Secretaria Paroquial e junte-se
                a esta missão de acolher, formar e servir.
              </p>
              <p>
                Cada contribuição é um passo importante na construção deste
                sonho. Juntos, somos Igreja em construção. Participe!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link
                href="/quero-contribuir"
                className="bg-[#faba45] hover:bg-[#f5aa2e] text-[#2b2b2b] text-[15px] px-5 py-2.5 rounded-lg transition-colors shadow-sm inline-block"
                style={{ fontWeight: 500 }}
              >
                Quero Contribuir
              </Link>
              {/* <button
                className="flex items-center gap-1 text-[#7b4f37] text-[14px] hover:text-[#4a2f24] transition-colors"
                style={{ fontWeight: 500 }}
              >
                Saiba Mais
                <ChevronRight size={15} />
              </button> */}
            </div>
          </div>

          {/* img */}
          <div className="w-full lg:w-[46%] shrink-0">
            <div className="relative rounded-2xl overflow-hidden shadow-md aspect-4/3">
              <img
                src="/Desktop5/9501870a6d2e000e824b7f82399914486cb30cfd.png"
                alt="Centro Pastoral da Paróquia São José"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-[#e0e0e0] rounded-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
