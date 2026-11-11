import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return <footer className="bwd-footer"><div className="bwd-footer-grid">
    <div className="bwd-footer-brand"><p className="bwd-eyebrow">Ben Wada Déco</p><h2>L’art de vivre<br />sur mesure.</h2><p>Décoration intérieure et mobilier personnalisé, entre élégance contemporaine et savoir-faire artisanal.</p><Link className="bwd-footer-cta" to="/demander-un-devis">Parlons de votre projet →</Link></div>
    <div><h3>Contact</h3><a className="bwd-footer-contact" href="tel:+21628540101"><Phone size={15} /><span>+216 28 540 101</span></a><a className="bwd-footer-contact" href="mailto:rayenwada38@gmail.com"><Mail size={15} /><span>rayenwada38@gmail.com</span></a><p className="bwd-footer-contact"><MapPin size={15} /><span>Tunisie</span></p><a className="bwd-footer-contact" href="https://www.instagram.com/ben_wada_deco/" target="_blank" rel="noreferrer"><span>Instagram · @ben_wada_deco</span></a></div>
    <div><h3>Navigation</h3><nav className="bwd-footer-nav"><Link to="/services">Services</Link><Link to="/produits">Produits</Link><Link to="/realisations">Réalisations</Link><Link to="/demander-un-devis">Demander un devis</Link></nav></div>
  </div><p className="bwd-copyright">© 2026 Ben Wada Déco. Tous droits réservés.</p></footer>;
}
