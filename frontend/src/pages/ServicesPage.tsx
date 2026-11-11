import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Page } from "../components/Page";

export type ServiceSummary = { slug: string; title: string; text: string; image: string };

export function ServicesPage({ services }: { services: ServiceSummary[] }) {
  return <Page variant="bwd-services-page" title="Nos services" subtitle="Des solutions pensées pour votre intérieur.">
    <div className="bwd-service-list">
      {services.map((service) => <article key={service.slug}>
        <Link to={`/services/${service.slug}`}><img src={service.image} alt={service.title} /></Link>
        <div><h2><Link to={`/services/${service.slug}`}>{service.title}</Link></h2><p>{service.text}</p><Link className="bwd-dark-button" to={`/services/${service.slug}`}>Découvrir le service</Link></div>
      </article>)}
    </div>
  </Page>;
}

type ServiceCategory = { slug: string; title: string; text: string; image: string; gallery: string[] };
export type ServiceDetail = ServiceSummary & { gallery: string[]; categories?: ServiceCategory[] };

export function ServiceDetailPage({ services }: { services: ServiceDetail[] }) {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);
  const [selectedImage, setSelectedImage] = useState(service?.gallery[0] ?? "");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("all");
  useEffect(() => { setSelectedImage(service?.gallery[0] ?? ""); setSelectedCategorySlug("all"); }, [slug]);
  if (!service) return <Page title="Page introuvable" subtitle="La page demandée n’existe pas."><Link className="bwd-dark-button" to="/">Retour à l’accueil</Link></Page>;
  const selectedCategory = service.categories?.find((category) => category.slug === selectedCategorySlug);
  const gallery = selectedCategory?.gallery ?? service.gallery;
  const title = selectedCategory?.title ?? service.title;
  const text = selectedCategory?.text ?? service.text;
  return <Page variant="bwd-service-detail-page" title={service.title} subtitle={service.text}>
    <section className="bwd-product-detail"><div className="bwd-product-main-image"><img src={selectedImage} alt={title} /></div><div className="bwd-product-information">
      <p className="bwd-eyebrow">Service</p><h2>{title}</h2><p>{text}</p>
      {service.categories && <div className="bwd-service-categories" aria-label="Choisir une catégorie de revêtement mural"><button type="button" className={selectedCategorySlug === "all" ? "active" : ""} onClick={() => { setSelectedCategorySlug("all"); setSelectedImage(service.gallery[0]); }}>Tous les modèles</button>{service.categories.map((category) => <button type="button" key={category.slug} className={selectedCategorySlug === category.slug ? "active" : ""} onClick={() => { setSelectedCategorySlug(category.slug); setSelectedImage(category.gallery[0]); }}>{category.title}</button>)}</div>}
      <div className="bwd-product-thumbnails">{gallery.map((image, index) => <button type="button" key={image} onClick={() => setSelectedImage(image)} className={image === selectedImage ? "active" : ""} aria-label={`Afficher l’image ${index + 1} de ${title}`}><img src={image} alt="" /></button>)}</div>
      <Link className="bwd-dark-button" to="/demander-un-devis">Demander un devis</Link>
    </div></section>
  </Page>;
}
