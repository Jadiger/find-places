import { ReactNode } from 'react'
import { FiHome, FiPhone } from 'react-icons/fi'
interface Links  {
    path : string,
    label : string,
    icon : ReactNode
}
export const links: Links[] = [
  {
    path: "/",
    label: "Home",
    icon: <FiHome />,
  },
  {
    path: "/contact",
    label: "Contact",
    icon: <FiPhone />,
  },
];