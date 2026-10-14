import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/brand/logo-white.png";

export function Logo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center ${className}`} aria-label="Alfano Cars — Home">
      <Image src={logo} alt="Alfano Cars" priority={priority} sizes="160px" className="h-9 w-auto sm:h-10" />
    </Link>
  );
}
