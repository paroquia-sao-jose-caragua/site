"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "./utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string | ((props: { isActive: boolean }) => string);
  end?: boolean;
  style?: React.CSSProperties;
  isActive?: boolean;
  onClick?: () => void;
}

export function NavLink({
  href,
  children,
  className = "",
  end = false,
  onClick,
  style,
  isActive: explicitIsActive,
}: NavLinkProps) {
  const pathname = usePathname();

  const isActive =
    explicitIsActive !== undefined
      ? explicitIsActive
      : end
        ? pathname === href
        : pathname.startsWith(href);

  if (typeof className === "function") {
    return (
      <Link
        href={href}
        className={className({ isActive })}
        onClick={onClick}
        style={style}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex items-center transition-all duration-200 rounded-lg px-3.5 py-1.5 text-md font-medium text-[#32402A] hover:text-[#B8872E] hover:bg-[#B8872E]/8",
        isActive && "bg-[#B8872E]/15 text-[#8c6218] font-semibold",
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </Link>
  );
}
