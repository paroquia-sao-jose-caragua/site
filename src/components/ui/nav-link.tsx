"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
}: NavLinkProps) {
  const pathname = usePathname();

  const isActive = end ? pathname === href : pathname.startsWith(href);

  const resolvedClassName =
    typeof className === "function" ? className({ isActive }) : className;

  return (
    <Link
      href={href}
      className={[
        resolvedClassName,
        isActive ? "text-[#BB8835]" : "text-[#32402A] hover:text-[#BB8835]",
      ].join(" ")}
      onClick={onClick}
      style={style}
    >
      {children}
    </Link>
  );
}
