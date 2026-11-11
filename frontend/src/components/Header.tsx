import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navLinks = [["Accueil", "/"], ["Produits", "/produits"], ["Services", "/services"], ["Réalisations", "/realisations"], ["Contact", "/contact"]];

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="bwd-header"><div className="bwd-header-inner">
    <Link className="bwd-brand" to="/">Ben Wada Déco</Link>
    <button className="bwd-menu" type="button" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">{open ? <X /> : <Menu />}</button>
    <nav className={open ? "bwd-nav open" : "bwd-nav"}>
      {navLinks.map(([label, url]) => <NavLink onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "active" : ""} key={url} to={url}>{label}</NavLink>)}
      <Link onClick={() => setOpen(false)} className="bwd-dark-button" to="/demander-un-devis">Demander un devis</Link>
      <a className="bwd-chat" href="https://wa.me/21628540101" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={19} /></a>
    </nav>
  </div></header>;
}
