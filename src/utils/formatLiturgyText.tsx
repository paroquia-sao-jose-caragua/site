import React from "react";

/**
 * Formats liturgy scripture text by detecting verse numbers (e.g. "31aspirai", "13,1Se", "2Se", "10Mas")
 * and adding a space with a bold font weight for the verse number.
 */
export function formatLiturgyText(
  text: string | undefined | null,
  verseClassName = "font-bold text-[#a6824b] font-sans inline-block mr-1 ml-0.5"
): React.ReactNode {
  if (!text) return null;

  // Matches verse numbers (e.g. "31", "13,1", "2") attached to or preceding words
  const verseRegex = /(?:^|(?<=[\s.,;:!?–—\(\)]))(\d+(?:,\d+)?)\s*([a-zA-ZÀ-ÿ])/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = verseRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const verseNum = match[1];
    const firstLetter = match[2];

    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }

    parts.push(
      <span
        key={matchIndex}
        className={verseClassName}
      >
        {verseNum}
      </span>
    );
    parts.push(firstLetter);

    lastIndex = verseRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
