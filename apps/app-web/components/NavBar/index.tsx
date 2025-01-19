import { Navbar as NavbarUI } from "@ui/components/ui/navbar";

export const NavBar = () => {
  return (
    <NavbarUI title="Navbar">
      <a href="#" className="hover:underline">
        Link 1
      </a>
    </NavbarUI>
  );
};
