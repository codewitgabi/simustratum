import Logo from "@/components/Logo";

function Nav() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b-2 border-ink bg-cream px-5 max-sm:px-5 sm:px-8 min-[1101px]:px-[60px]">
      <Logo />
      <ul className="flex max-sm:hidden list-none items-center gap-2">
        <li>
          <a
            href="#features"
            className="neu-nav-link border-2 border-transparent px-4 py-[7px] text-[0.875rem] font-semibold text-ink no-underline"
          >
            Features
          </a>
        </li>
        <li>
          <a
            href="#how"
            className="neu-nav-link border-2 border-transparent px-4 py-[7px] text-[0.875rem] font-semibold text-ink no-underline"
          >
            How it works
          </a>
        </li>
        <li>
          <a
            href="#modes"
            className="neu-nav-link border-2 border-transparent px-4 py-[7px] text-[0.875rem] font-semibold text-ink no-underline"
          >
            Modes
          </a>
        </li>
        <li>
          <a
            href="#"
            className="neu-press-sm border-2 border-ink bg-sienna px-4 py-[7px] font-grotesk text-[0.875rem] font-bold text-white no-underline shadow-neu-sm"
          >
            Get Early Access
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
