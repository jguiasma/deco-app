import { Link } from "react-router-dom";
import { Page } from "../components/Page";

export function ContactPage() {
  return <Page variant="bwd-contact-page" title="Parlons de votre projet" subtitle="Notre équipe est à votre écoute pour répondre à vos questions.">
    <div className="bwd-form-layout"><div className="bwd-contact"><p><a href="tel:+21628540101">☎ +216 28 540 101</a></p><p><a href="mailto:rayenwada38@gmail.com">✉ rayenwada38@gmail.com</a></p><p>⌖ Tunisie</p><Link className="bwd-dark-button" to="/rendez-vous">Prendre rendez-vous</Link></div><form className="bwd-form"><label>Nom complet<input placeholder="Votre nom" /></label><label>E-mail<input type="email" placeholder="vous@email.com" /></label><label>Sujet<input placeholder="Votre demande" /></label><label>Message<textarea rows={6} placeholder="Écrivez votre message…" /></label><button type="button" className="bwd-dark-button">Envoyer le message</button></form></div>
  </Page>;
}
