import { NavLink } from "react-router";
import { links } from "./links";

function Aside({ toggle }: { toggle: () => void }) {
  return links.map((link, index) => (
    <NavLink
      key={index}
      to={link.path}
      onClick={toggle}
      className="flex items-center gap-2 font-medium px-3 py-2 rounded-md"
    >
      {link.icon}
      {link.label}
    </NavLink>
  ));
}

export default Aside;
