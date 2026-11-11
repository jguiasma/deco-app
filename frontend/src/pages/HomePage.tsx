import { Armchair, Box, ChevronLeft, ChevronRight, FileText, Gem, Handshake, Paintbrush, Ruler } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ProductSummary } from "./ProductsPage";
import type { ServiceSummary } from "./ServicesPage";

type HomePageProps = { services: ServiceSummary[]; products: ProductSummary[]; heroVideo: string; trustImages: string[] };

function TrustCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => { const interval = window.setInterval(() => setCurrent((index) => (index + 1) % images.length), 5000); return () => window.clearInterval(interval); }, [images.length]);
  return <section className="bwd-trust bwd-reveal"><div className="bwd-container"><div className="bwd-trust-copy"><p className="bwd-eyebrow">Confiance & reconnaissance</p><h2>Une rencontre qui nous inspire</h2><span className="bwd-trust-line" /><p>Un moment de partage et de reconnaissance autour de l’entrepreneuriat et du savoir-faire tunisien.</p><p className="bwd-trust-signature">Ben Wada Déco · Savoir-faire tunisien</p></div><div className="bwd-carousel"><img src={images[current]} alt={`Photo de rencontre institutionnelle ${current + 1}`} /><button type="button" className="bwd-carousel-previous" onClick={() => setCurrent((index) => (index - 1 + images.length) % images.length)} aria-label="Photo précédente"><ChevronLeft size={22} /></button><button type="button" className="bwd-carousel-next" onClick={() => setCurrent((index) => (index + 1) % images.length)} aria-label="Photo suivante"><ChevronRight size={22} /></button><div className="bwd-carousel-thumbnails">{images.map((image, index) => <button key={image} type="button" aria-label={`Afficher la photo ${index + 1}`} onClick={() => setCurrent(index)} className={index === current ? "active" : ""}><img src={image} alt="" /></button>)}</div></div></div></section>;
}

export function HomePage({ services, products, heroVideo, trustImages }: HomePageProps) {
  useEffect(() => { const elements = document.querySelectorAll<HTMLElement>(".bwd-reveal"); const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .14, rootMargin: "0px 0px -55px" }); elements.forEach((element) => observer.observe(element)); return () => observer.disconnect(); }, []);
  const benefits = [[Ruler, "Réalisations sur mesure", "Des solutions pensées pour votre espace."], [Gem, "Matériaux de qualité", "Des finitions sélectionnées avec soin."], [Handshake, "Accompagnement personnalisé", "Une écoute attentive à chaque étape."], [FileText, "Devis rapides", "Une estimation claire de votre projet."]] as const;
  const serviceIcons = { "revetement-mural": Paintbrush, "meuble-sur-mesure": Armchair, "conception-3d": Box };
  return <main>
    <section className="bwd-hero bwd-video-carousel"><video className="bwd-hero-video active" autoPlay muted loop playsInline preload="auto"><source src={heroVideo} type="video/mp4" /></video><span className="bwd-hero-overlay" /><div className="bwd-hero-content"><p className="bwd-eyebrow light">Ben Wada Déco</p><h1>Décoration intérieure<br />et fabrication sur mesure</h1><p>Transformez votre intérieur avec des solutions modernes, élégantes et personnalisées.</p><div className="bwd-actions"><Link className="bwd-light-button" to="/demander-un-devis">Demander une estimation de devis</Link><Link className="bwd-outline-light" to="/rendez-vous">Prendre un rendez-vous</Link></div></div></section>
    <section className="bwd-service-showcase" aria-label="Nos services">
      <div className="bwd-service-showcase-label">Nos prestations</div>
      <div className="bwd-service-showcase-viewport">
        <div className="bwd-service-showcase-track">
          {[...services, ...services].map((service, index) => { const Icon = serviceIcons[service.slug as keyof typeof serviceIcons] ?? Box; return <Link key={`${service.slug}-${index}`} to={`/services/${service.slug}`} className={`bwd-service-showcase-item bwd-service-showcase-${service.slug}`}><span><Icon size={18} strokeWidth={1.8} /></span>{service.title}</Link>; })}
        </div>
      </div>
    </section>
    <section className="bwd-benefits bwd-reveal" aria-label="Nos engagements">{benefits.map(([Icon, title, text]) => <article key={title}><span className="bwd-benefit-icon"><Icon size={19} strokeWidth={1.5} /></span><div><h2>{title}</h2><p>{text}</p></div></article>)}</section>
    <section className="bwd-section bwd-cream bwd-reveal"><div className="bwd-container"><p className="bwd-eyebrow">Notre savoir-faire</p><h2>Nos services</h2><div className="bwd-cards">{services.map((service) => <article key={service.slug}><Link to={`/services/${service.slug}`}><img src={service.image} alt={service.title} /></Link><div><h3><Link to={`/services/${service.slug}`}>{service.title}</Link></h3><p>{service.text}</p><Link to={`/services/${service.slug}`}>Découvrir →</Link></div></article>)}</div></div></section>
    <section className="bwd-section bwd-products-section bwd-reveal"><div className="bwd-container"><div className="bwd-products-heading"><p className="bwd-eyebrow">Sélection</p><h2>Produits phares</h2></div><div className="bwd-products">{products.slice(0, 3).map((product) => <article key={product.slug}><Link to={`/produits/${product.slug}`}><img src={product.gallery[0]} alt={product.title} /></Link><h3><Link to={`/produits/${product.slug}`}>{product.title}</Link></h3><p>{product.price}</p></article>)}</div><Link className="bwd-all-products" to="/produits">Voir tout le catalogue →</Link></div></section>
    <TrustCarousel images={trustImages} />
    <section className="bwd-cta bwd-reveal"><p className="bwd-eyebrow">Votre projet</p><h2>Vous avez un projet ?</h2><p>Demandez une première estimation ou prenez directement rendez-vous avec notre équipe.</p><div className="bwd-actions"><Link className="bwd-dark-button" to="/demander-un-devis">Demander une estimation de devis</Link><Link className="bwd-outline-button" to="/rendez-vous">Prendre un rendez-vous</Link></div></section>
  </main>;
}
