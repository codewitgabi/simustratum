import Logo from "@/components/Logo";

function Nav() {
  return (
    <nav>
      <Logo />
      <ul className="nav-links">
        <li>
          <a href="#features">Features</a>
        </li>
        <li>
          <a href="#how">How it works</a>
        </li>
        <li>
          <a href="#modes">Modes</a>
        </li>
        <li>
          <a href="#" className="nav-cta">
            Get Early Access
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
