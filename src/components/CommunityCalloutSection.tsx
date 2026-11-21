"use client";

export function CommunityCalloutSection() {
  return (
    <section className="bg-[#fbf6ee] text-[#18351E] relative overflow-hidden pt-4 pb-24 md:pb-36">
      {/* Onda decorativa inferior */}
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
          pointer-events-none
        "
      />
    </section>
  );
}

