import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Page } from "../components/Page";

export type ProductSummary = { slug: string; title: string; price: string; gallery: string[] };

export function ProductsPage({ products }: { products: ProductSummary[] }) {
  return <Page variant="bwd-products-page" title="Nos produits" subtitle="Découvrez une sélection de produits pour personnaliser vos espaces.">
    <div className="bwd-products four">
      {products.map((product) => <article key={product.slug}><Link className="bwd-product-card-link" to={`/produits/${product.slug}`}><img src={product.gallery[0]} alt={product.title} /><h3>{product.title}</h3><p>{product.price}</p></Link></article>)}
    </div>
  </Page>;
}

export type ProductDetail = ProductSummary & { description: string };

export function ProductDetailPage({ products }: { products: ProductDetail[] }) {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  const [selectedImage, setSelectedImage] = useState(product?.gallery[0] ?? "");
  useEffect(() => setSelectedImage(product?.gallery[0] ?? ""), [slug]);
  if (!product) return <Page title="Page introuvable" subtitle="La page demandée n’existe pas."><Link className="bwd-dark-button" to="/">Retour à l’accueil</Link></Page>;
  return <Page variant="bwd-product-detail-page" title={product.title} subtitle={product.description}><section className="bwd-product-detail"><div className="bwd-product-main-image"><img src={selectedImage} alt={product.title} /></div><div className="bwd-product-information"><p className="bwd-eyebrow">Produit</p><h2>{product.title}</h2><p className="bwd-product-price">{product.price}</p><p>{product.description}</p><div className="bwd-product-thumbnails">{product.gallery.map((image, index) => <button type="button" key={image} onClick={() => setSelectedImage(image)} className={image === selectedImage ? "active" : ""} aria-label={`Afficher l’image ${index + 1} de ${product.title}`}><img src={image} alt="" /></button>)}</div><Link className="bwd-dark-button" to="/demander-un-devis">Demander un devis</Link></div></section></Page>;
}
