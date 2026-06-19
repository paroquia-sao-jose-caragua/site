"use client";

import { useState } from "react";
import { X, MapPin, Clock, Map, Copy, Check } from "lucide-react";
import { communities, type Community } from "../data/agendaData";

import { useRouter } from "next/navigation";

const communityImages: Record<string, string> = {
  psj: "/Desktop5/e1d50cae9fab58435153a4c41bbf85789ad42f26.png",
  cse: "/Desktop5/05954d1396cd22d752a9383cc71f05004fb83a94.png",
  cnsr: "/Desktop5/7387a98bd8b87ea87349155d8dcfa3b57becde99.png",
  csf: "/Desktop5/8923874a787fb8983e3c782e8248f74411a5c7b1.png",
  cscj: "/Desktop5/455ffb51a3b40639c1fdae0be7b7b8c147a6c4b4.png",
};

interface CommunityModalProps {
  community: Community;
  onClose: () => void;
}

function CommunityModal({ community, onClose }: CommunityModalProps) {
  const router = useRouter();
  const img = communityImages[community.id];
  const [copied, setCopied] = useState(false);

  const handleViewSchedule = () => {
    onClose();
    router.push(`/agenda?comunidade=${community.id}`);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(community.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(community.address)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-100 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 size-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-[#4a2f24] transition-colors"
          aria-label="Fechar"
        >
          <X size={15} />
        </button>

        {/* Content */}
        <div className="p-6 pt-8">
          {/* Circular photo + name */}
          <div className="flex flex-col items-center text-center mb-5">
            <img
              src={img}
              alt={community.name}
              className="size-24 rounded-full object-cover ring-4 ring-[#dcc2b5] mb-4"
            />
            <h2
              className="text-[#1a1a1a] text-[18px]"
              style={{ fontWeight: 700, lineHeight: 1.3 }}
            >
              {community.name}
            </h2>
          </div>

          {/* Address row */}
          <div className="flex items-start gap-2.5 mb-4">
            <MapPin size={15} className="text-[#a45d00] shrink-0 mt-0.5" />
            <p
              className="text-[#6b7280] text-[14px] flex-1"
              style={{ lineHeight: 1.6 }}
            >
              {community.address}
            </p>
            <button
              onClick={handleCopyAddress}
              title="Copiar endereço"
              className={[
                "shrink-0 size-7 flex items-center justify-center rounded-lg border transition-all mt-0.5",
                copied
                  ? "bg-green-50 border-green-300 text-green-600"
                  : "border-[#e5e7eb] text-[#9ca3af] hover:border-[#dcc2b5] hover:text-[#7b4f37]",
              ].join(" ")}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>

          {/* Open in Maps */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#f9f5f2] hover:bg-[#f0ebe6] border border-[#dcc2b5] text-[#4a2f24] text-[14px] py-2.5 rounded-xl transition-colors mb-3"
            style={{ fontWeight: 500 }}
          >
            <Map size={15} />
            Abrir no Mapa
          </a>

          {/* View schedule */}
          <button
            onClick={handleViewSchedule}
            className="w-full flex items-center justify-center gap-2 bg-[#4a2f24] hover:bg-[#3d2318] text-[#f9f5f2] text-[14px] py-3 rounded-xl transition-colors shadow-sm"
            style={{ fontWeight: 600 }}
          >
            <Clock size={15} />
            Ver Horários de Missa
          </button>
        </div>
      </div>
    </div>
  );
}

export function CommunitiesSection() {
  const [selected, setSelected] = useState<Community | null>(null);

  return (
    <section id="comunidades" className="py-20 bg-[#f9f5f2]">
      <div className="max-w-300 mx-auto px-6">
        <div className="mb-10">
          <p
            className="text-[#4a2f24] text-[11px] uppercase tracking-widest mb-1"
            style={{ fontWeight: 500 }}
          >
            Igreja
          </p>
          <h2
            className="text-[#4a2f24] text-[26px]"
            style={{ fontWeight: 600, lineHeight: 1.3 }}
          >
            Conheça Nossas Comunidades
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
          {communities.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="flex flex-col items-center gap-4 group cursor-pointer text-center focus:outline-none"
            >
              <div className="relative size-35 md:size-40 shrink-0">
                <img
                  src={communityImages[c.id]}
                  alt={c.name}
                  className="size-full object-cover rounded-full ring-4 ring-[#dcc2b5] group-hover:ring-[#7b4f37] group-hover:scale-[1.03] transition-all duration-300"
                />
              </div>
              <p
                className="text-[#7b4f37] text-[15px] group-hover:text-[#4a2f24] transition-colors"
                style={{ fontWeight: 600, lineHeight: 1.4 }}
              >
                {c.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <CommunityModal
          community={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
