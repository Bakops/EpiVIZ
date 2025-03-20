import Link from "next/link";

export default function HeaderComponent() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white shadow-md">
      <Link href="#">
        <a className="flex items-center justify-center">
          <div className="text-[30px] text-[#000] font-poppins font-[700] flex flex-row items-center justify-center gap-1">
            EPIVIZ <span className="text-[#5B986D] text-5xl">.</span>
          </div>
        </a>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link href="#">
          <a className="text-sm font-poppins font-medium hover:underline underline-offset-4 text-black">
            Accueil
          </a>
        </Link>
        <Link href="/dashboard">
          <a className="text-sm font-poppins font-medium hover:underline underline-offset-4 text-black">
            Tableau de bord
          </a>
        </Link>
        <Link href="/api-docs">
          <a className="text-sm font-poppins font-medium hover:underline underline-offset-4 text-black">
            API
          </a>
        </Link>
        <Link href="/about">
          <a className="text-sm font-poppins font-medium hover:underline underline-offset-4 text-black">
            À propos
          </a>
        </Link>
      </nav>
    </header>
  );
}
