import { ChevronLeft, ChevronRight, FileText, Gem, Handshake, Mail, MapPin, Menu, MessageCircle, Phone, Ruler, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useParams } from 'react-router-dom'
import muralImage from './assets/images/services/revetement-murale/IMG_8582.jpeg'
import meubleImage from './assets/images/services/meubles-sur-mesure/surmes.jpg'
import conceptionImage from './assets/images/services/conception3d/03947e41-bb43-4546-a002-595fa4aabca7.jpeg'
import moulureImage from './assets/images/products/moulure/IMG_7294.jpeg'
import miroirImage from './assets/images/products/mirroire/IMG_0429.jpeg'
import bardageImage from './assets/images/products/bardage/IMG_1465.png'
import trustOne from './assets/images/trust/IMG_9440.jpeg'
import trustTwo from './assets/images/trust/IMG_9428.jpeg'
import trustThree from './assets/images/trust/IMG_7631.jpeg'
import heroVideoSix from './assets/videos/6.mp4'
import realizationVideoOne from './assets/videos/1.mp4'
import realizationVideoTwo from './assets/videos/2.mp4'
import realizationVideoThree from './assets/videos/3.mp4'
import realizationVideoFour from './assets/videos/4.mp4'
import './website.css'

const navLinks = [
  ['Accueil', '/'], ['Produits', '/produits'], ['Services', '/services'], ['Réalisations', '/realisations'], ['Contact', '/contact'],
]

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="bwd-header"><div className="bwd-header-inner">
    <Link className="bwd-brand" to="/">Ben Wada Déco</Link>
    <button className="bwd-menu" type="button" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">{open ? <X /> : <Menu />}</button>
    <nav className={open ? 'bwd-nav open' : 'bwd-nav'}>{navLinks.map(([label, url]) => <NavLink onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'active' : ''} key={url} to={url}>{label}</NavLink>)}<Link onClick={() => setOpen(false)} className="bwd-dark-button" to="/demander-un-devis">Demander un devis</Link><a className="bwd-chat" href="https://wa.me/21600000000" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={19} /></a></nav>
  </div></header>
}

function Footer() { return <footer className="bwd-footer"><div className="bwd-footer-grid"><div className="bwd-footer-brand"><p className="bwd-eyebrow">Ben Wada Déco</p><h2>L’art de vivre<br />sur mesure.</h2><p>Décoration intérieure et mobilier personnalisé, entre élégance contemporaine et savoir-faire artisanal.</p><Link className="bwd-footer-cta" to="/demander-un-devis">Parlons de votre projet →</Link></div><div><h3>Contact</h3><a className="bwd-footer-contact" href="tel:+21600000000"><Phone size={15} /><span>+216 XX XXX XXX</span></a><a className="bwd-footer-contact" href="mailto:contact@benwadadeco.com"><Mail size={15} /><span>contact@benwadadeco.com</span></a><p className="bwd-footer-contact"><MapPin size={15} /><span>Tunisie</span></p></div><div><h3>Navigation</h3><nav className="bwd-footer-nav"><Link to="/services">Services</Link><Link to="/produits">Produits</Link><Link to="/realisations">Réalisations</Link><Link to="/demander-un-devis">Demander un devis</Link></nav></div></div><p className="bwd-copyright">© 2026 Ben Wada Déco. Tous droits réservés.</p></footer> }

const galleryWithCover = (cover: string, images: string[]) => [cover, ...images.filter((image) => image !== cover)]
const serviceImageGroups = {
  revetement: Object.values(import.meta.glob('./assets/images/services/revetement-murale/**/*.{jpeg,jpg,png}', { eager: true, import: 'default' })) as string[],
  meubles: Object.values(import.meta.glob('./assets/images/services/meubles-sur-mesure/*.{jpeg,jpg,png}', { eager: true, import: 'default' })) as string[],
  conception: Object.values(import.meta.glob('./assets/images/services/conception3d/*.{jpeg,jpg,png}', { eager: true, import: 'default' })) as string[],
}
const services = [
  { slug: 'revetement-mural', title: 'Revêtement mural', text: 'Moulures, bardages et habillages élégants pour structurer votre espace.', image: muralImage, gallery: galleryWithCover(muralImage, serviceImageGroups.revetement) },
  { slug: 'meuble-sur-mesure', title: 'Meuble sur mesure', text: 'Du mobilier pensé pour vos dimensions, vos besoins et votre style.', image: meubleImage, gallery: galleryWithCover(meubleImage, serviceImageGroups.meubles) },
  { slug: 'conception-3d', title: 'Conception 3D', text: 'Visualisez votre intérieur avant le début des travaux.', image: conceptionImage, gallery: galleryWithCover(conceptionImage, serviceImageGroups.conception) },
]

const trustImages = [trustOne, trustTwo, trustThree]
const productImageGroups = {
  moulures: Object.values(import.meta.glob('./assets/images/products/moulure/*.{jpeg,jpg,png}', { eager: true, import: 'default' })) as string[],
  miroirs: Object.values(import.meta.glob('./assets/images/products/mirroire/*.{jpeg,jpg,png}', { eager: true, import: 'default' })) as string[],
  bardages: Object.values(import.meta.glob('./assets/images/products/bardage/*.{jpeg,jpg,png}', { eager: true, import: 'default' })) as string[],
  autres: Object.values(import.meta.glob('./assets/images/products/autres/*.{jpeg,jpg,png}', { eager: true, import: 'default' })) as string[],
}
const products = [
  { slug: 'moulures-murales', title: 'Moulures murales', price: 'Sur devis', description: 'Des moulures décoratives élégantes pour donner du relief et du caractère à vos murs.', gallery: galleryWithCover(moulureImage, productImageGroups.moulures) },
  { slug: 'miroir-biseaute-30x30', title: 'Miroir biseauté 30 × 30 cm', price: '35 DT', description: 'Un miroir biseauté raffiné, idéal pour apporter lumière et profondeur à votre intérieur.', gallery: galleryWithCover(miroirImage, productImageGroups.miroirs) },
  { slug: 'bardage-rayure-16cm', title: 'Bardage rayuré 16 cm', price: '48 DT / pièce', description: 'Un bardage décoratif moderne qui structure l’espace avec des lignes élégantes.', gallery: galleryWithCover(bardageImage, productImageGroups.bardages) },
  { slug: 'badil-chipboard', title: 'بديل chipboard', price: 'Sur devis', description: 'Une solution décorative pratique et esthétique pour vos projets d’aménagement.', gallery: galleryWithCover(meubleImage, productImageGroups.autres) },
]
const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost/api').replace(/\/$/, '')
type PublicApiService = { id: number; title: string }
type Estimate = { estimated_min: number; estimated_max: number; currency: string; note: string }
type ApiErrors = Record<string, string[]>
type PricingRule = { id: number; service_id: number; unit: 'm2' | 'meter' | 'piece'; calculation_method: 'fixed' | 'per_unit' | 'prorata'; reference_quantity: string | number | null; min_price: string | number; max_price: string | number; is_active: boolean; service?: { id: number; title: string } }
type PricingRuleForm = { service_id: string; unit: 'm2' | 'meter' | 'piece'; calculation_method: 'fixed' | 'per_unit' | 'prorata'; reference_quantity: string; min_price: string; max_price: string; is_active: boolean }
const emptyPricingRuleForm = (): PricingRuleForm => ({ service_id: '', unit: 'm2', calculation_method: 'prorata', reference_quantity: '100', min_price: '', max_price: '', is_active: true })
const realizationImages = Object.values(
  import.meta.glob('./assets/images/realizations/*.{jpeg,jpg,png}', {
    eager: true,
    import: 'default',
  }),
) as string[]

function HeroVideoWall() {
  return <section className="bwd-hero bwd-video-carousel">
    <video className="bwd-hero-video active" autoPlay muted loop playsInline preload="auto"><source src={heroVideoSix} type="video/mp4" /></video>
    <span className="bwd-hero-overlay" />
    <div className="bwd-hero-content"><p className="bwd-eyebrow light">Ben Wada Déco</p><h1>Décoration intérieure<br />et fabrication sur mesure</h1><p>Transformez votre intérieur avec des solutions modernes, élégantes et personnalisées.</p><div className="bwd-actions"><Link className="bwd-light-button" to="/demander-un-devis">Demander un devis</Link><Link className="bwd-outline-light" to="/rendez-vous">Prendre rendez-vous</Link></div></div>
  </section>
}

function TrustCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => setCurrent((index) => (index + 1) % trustImages.length), 5000)
    return () => window.clearInterval(interval)
  }, [])

  const previous = () => setCurrent((index) => (index - 1 + trustImages.length) % trustImages.length)
  const next = () => setCurrent((index) => (index + 1) % trustImages.length)

  return <section className="bwd-trust bwd-reveal"><div className="bwd-container"><div className="bwd-trust-copy"><p className="bwd-eyebrow">Confiance & reconnaissance</p><h2>Une rencontre qui nous inspire</h2><span className="bwd-trust-line" /><p>Un moment de partage et de reconnaissance autour de l’entrepreneuriat et du savoir-faire tunisien.</p><p className="bwd-trust-signature">Ben Wada Déco · Savoir-faire tunisien</p></div><div className="bwd-carousel"><img src={trustImages[current]} alt={`Photo de rencontre institutionnelle ${current + 1}`} /><button type="button" className="bwd-carousel-previous" onClick={previous} aria-label="Photo précédente"><ChevronLeft size={22} /></button><button type="button" className="bwd-carousel-next" onClick={next} aria-label="Photo suivante"><ChevronRight size={22} /></button><div className="bwd-carousel-thumbnails">{trustImages.map((image, index) => <button key={image} type="button" aria-label={`Afficher la photo ${index + 1}`} onClick={() => setCurrent(index)} className={index === current ? 'active' : ''}><img src={image} alt="" /></button>)}</div></div></div></section>
}

function HomePage() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.bwd-reveal')
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }), { threshold: 0.14, rootMargin: '0px 0px -55px' })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return <main>
  <HeroVideoWall />
  <section className="bwd-benefits bwd-reveal" aria-label="Nos engagements"><article><span className="bwd-benefit-icon"><Ruler size={19} strokeWidth={1.5} /></span><div><h2>Réalisations sur mesure</h2><p>Des solutions pensées pour votre espace.</p></div></article><article><span className="bwd-benefit-icon"><Gem size={19} strokeWidth={1.5} /></span><div><h2>Matériaux de qualité</h2><p>Des finitions sélectionnées avec soin.</p></div></article><article><span className="bwd-benefit-icon"><Handshake size={19} strokeWidth={1.5} /></span><div><h2>Accompagnement personnalisé</h2><p>Une écoute attentive à chaque étape.</p></div></article><article><span className="bwd-benefit-icon"><FileText size={19} strokeWidth={1.5} /></span><div><h2>Devis rapides</h2><p>Une estimation claire de votre projet.</p></div></article></section>
  <section className="bwd-section bwd-cream bwd-reveal"><div className="bwd-container"><p className="bwd-eyebrow">Notre savoir-faire</p><h2>Nos services</h2><div className="bwd-cards">{services.map((service) => <article key={service.slug}><Link to={`/services/${service.slug}`}><img src={service.image} alt={service.title} /></Link><div><h3><Link to={`/services/${service.slug}`}>{service.title}</Link></h3><p>{service.text}</p><Link to={`/services/${service.slug}`}>Découvrir →</Link></div></article>)}</div></div></section>
  <section className="bwd-section bwd-products-section bwd-reveal"><div className="bwd-container"><div className="bwd-products-heading"><p className="bwd-eyebrow">Sélection</p><h2>Produits phares</h2></div><div className="bwd-products">{products.slice(0, 3).map((product) => <article key={product.slug}><Link to={`/produits/${product.slug}`}><img src={product.gallery[0]} alt={product.title} /></Link><h3><Link to={`/produits/${product.slug}`}>{product.title}</Link></h3><p>{product.price}</p></article>)}</div><Link className="bwd-all-products" to="/produits">Voir tout le catalogue →</Link></div></section>
  <TrustCarousel />
  <section className="bwd-cta bwd-reveal"><p className="bwd-eyebrow">Votre projet</p><h2>Vous avez un projet ?</h2><p>Parlons de votre idée et transformons-la en réalité.</p><div className="bwd-actions"><Link className="bwd-dark-button" to="/demander-un-devis">Demander un devis gratuit</Link><Link className="bwd-outline-button" to="/rendez-vous">Prendre rendez-vous</Link></div></section>
</main> }

function ServicesPage() { return <Page variant="bwd-services-page" title="Nos services" subtitle="Des solutions pensées pour votre intérieur."><div className="bwd-service-list">{services.map((service) => <article key={service.slug}><Link to={`/services/${service.slug}`}><img src={service.image} alt={service.title} /></Link><div><h2><Link to={`/services/${service.slug}`}>{service.title}</Link></h2><p>{service.text}</p><Link className="bwd-dark-button" to={`/services/${service.slug}`}>Découvrir le service</Link></div></article>)}</div></Page> }
function ServiceDetailPage() { const { slug } = useParams(); const service = services.find((item) => item.slug === slug); const [selectedImage, setSelectedImage] = useState(service?.gallery[0] ?? ''); if (!service) return <NotFound />; return <Page variant="bwd-service-detail-page" title={service.title} subtitle={service.text}><section className="bwd-product-detail"><div className="bwd-product-main-image"><img src={selectedImage} alt={service.title} /></div><div className="bwd-product-information"><p className="bwd-eyebrow">Service</p><h2>{service.title}</h2><p>{service.text}</p><div className="bwd-product-thumbnails">{service.gallery.map((image, index) => <button type="button" key={image} onClick={() => setSelectedImage(image)} className={image === selectedImage ? 'active' : ''} aria-label={`Afficher l’image ${index + 1} de ${service.title}`}><img src={image} alt="" /></button>)}</div><Link className="bwd-dark-button" to="/demander-un-devis">Demander un devis</Link></div></section></Page> }
function ProductsPage() { return <Page variant="bwd-products-page" title="Nos produits" subtitle="Découvrez une sélection de produits pour personnaliser vos espaces."><div className="bwd-products four">{products.map((product) => <article key={product.slug}><Link to={`/produits/${product.slug}`}><img src={product.gallery[0]} alt={product.title} /></Link><h3><Link to={`/produits/${product.slug}`}>{product.title}</Link></h3><p>{product.price}</p></article>)}</div></Page> }
function ProductDetailPage() { const { slug } = useParams(); const product = products.find((item) => item.slug === slug); const [selectedImage, setSelectedImage] = useState(product?.gallery[0] ?? ''); if (!product) return <NotFound />; return <Page variant="bwd-product-detail-page" title={product.title} subtitle={product.description}><section className="bwd-product-detail"><div className="bwd-product-main-image"><img src={selectedImage} alt={product.title} /></div><div className="bwd-product-information"><p className="bwd-eyebrow">Produit</p><h2>{product.title}</h2><p className="bwd-product-price">{product.price}</p><p>{product.description}</p><div className="bwd-product-thumbnails">{product.gallery.map((image, index) => <button type="button" key={image} onClick={() => setSelectedImage(image)} className={image === selectedImage ? 'active' : ''} aria-label={`Afficher l’image ${index + 1} de ${product.title}`}><img src={image} alt="" /></button>)}</div><Link className="bwd-dark-button" to="/demander-un-devis">Demander un devis</Link></div></section></Page> }
function RealisationsPage() { const videos = [realizationVideoOne, realizationVideoTwo, realizationVideoThree, realizationVideoFour]; return <Page variant="bwd-realisations-page" title="Nos réalisations" subtitle="Quelques projets réalisés avec passion pour nos clients."><section className="bwd-realization-videos"><div className="bwd-video-grid">{videos.map((video, index) => <article key={video}><video autoPlay muted loop playsInline preload="metadata" aria-label={`Vidéo de réalisation ${index + 1}`}><source src={video} type="video/mp4" /></video></article>)}</div></section><section className="bwd-realization-gallery"><p className="bwd-eyebrow">Galerie photo</p><div className="bwd-gallery">{realizationImages.map((image, index) => <img key={image} src={image} alt={`Réalisation ${index + 1}`} />)}</div></section></Page> }

function QuotePage() {
  const [services, setServices] = useState<PublicApiService[]>([])
  const [fields, setFields] = useState({ first_name: '', last_name: '', phone: '', email: '', city: '', address: '', service_id: '', service_type: '', quantity: '', dimensions: '', approximate_budget: '', description: '' })
  const [photos, setPhotos] = useState<File[]>([])
  const [errors, setErrors] = useState<ApiErrors>({})
  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const [loadingEstimate, setLoadingEstimate] = useState(false)
  const [sending, setSending] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetch(`${apiUrl}/services`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Impossible de charger les services.')
        return response.json()
      })
      .then((data) => setServices(data.data ?? []))
      .catch((error: Error) => setErrors({ form: [error.message] }))
  }, [])

  const setField = (name: keyof typeof fields, value: string) => {
    setFields((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: [] }))
    setSuccessMessage('')
  }

  const responseErrors = async (response: Response): Promise<ApiErrors> => {
    const data = await response.json().catch(() => null)
    return data?.errors ?? { form: [data?.message ?? 'Une erreur est survenue.'] }
  }

  const calculateEstimate = async () => {
    if (!fields.service_id || !fields.quantity || Number(fields.quantity) <= 0) {
      setErrors({ service_id: !fields.service_id ? ['Choisissez un service.'] : [], quantity: !fields.quantity || Number(fields.quantity) <= 0 ? ['Saisissez une quantité supérieure à zéro.'] : [] })
      return
    }
    setLoadingEstimate(true)
    setErrors({})
    setSuccessMessage('')
    try {
      const response = await fetch(`${apiUrl}/estimates`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ service_id: Number(fields.service_id), quantity: Number(fields.quantity) }) })
      if (!response.ok) {
        setEstimate(null)
        setErrors(await responseErrors(response))
        return
      }
      const data = await response.json()
      setEstimate(data.data)
    } catch {
      setErrors({ form: ['Impossible de joindre le serveur. Vérifiez que Laravel est démarré.'] })
    } finally {
      setLoadingEstimate(false)
    }
  }

  const submitQuote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSending(true)
    setErrors({})
    setSuccessMessage('')
    const data = new FormData()
    Object.entries(fields).forEach(([name, value]) => { if (value) data.append(name, value) })
    photos.forEach((photo) => data.append('photos[]', photo))
    try {
      const response = await fetch(`${apiUrl}/quote-requests`, { method: 'POST', headers: { Accept: 'application/json' }, body: data })
      if (!response.ok) {
        setErrors(await responseErrors(response))
        return
      }
      const result = await response.json()
      setEstimate({ estimated_min: Number(result.data.estimated_min), estimated_max: Number(result.data.estimated_max), currency: result.data.currency, note: 'Le montant affiché est une estimation indicative. Le prix final peut varier après la visite, la prise de mesures, le choix des matériaux et l’évaluation de la difficulté des travaux sur mesure.' })
      setSuccessMessage(`${result.message} Référence : #${result.data.id}.`)
    } catch {
      setErrors({ form: ['Impossible de joindre le serveur. Vérifiez que Laravel est démarré.'] })
    } finally {
      setSending(false)
    }
  }

  const error = (name: string) => errors[name]?.[0]
  const price = (value: number) => new Intl.NumberFormat('fr-TN', { maximumFractionDigits: 3 }).format(value)

  return <Page variant="bwd-quote-page" title="Demander un devis" subtitle="Décrivez votre besoin. Nous vous fournirons une estimation, puis un devis détaillé après étude."><div className="bwd-form-layout"><p className="bwd-note">Certains travaux sur mesure dépendent de la visite, des matériaux et de la difficulté.</p><form className="bwd-form" onSubmit={submitQuote} noValidate><div><label>Prénom *<input value={fields.first_name} onChange={(event) => setField('first_name', event.target.value)} placeholder="Votre prénom" required />{error('first_name') && <small className="bwd-field-error">{error('first_name')}</small>}</label><label>Nom *<input value={fields.last_name} onChange={(event) => setField('last_name', event.target.value)} placeholder="Votre nom" required />{error('last_name') && <small className="bwd-field-error">{error('last_name')}</small>}</label></div><div><label>Téléphone *<input value={fields.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="XX XXX XXX" required />{error('phone') && <small className="bwd-field-error">{error('phone')}</small>}</label><label>E-mail<input type="email" value={fields.email} onChange={(event) => setField('email', event.target.value)} placeholder="vous@email.com" />{error('email') && <small className="bwd-field-error">{error('email')}</small>}</label></div><div><label>Ville<input value={fields.city} onChange={(event) => setField('city', event.target.value)} placeholder="Votre ville" /></label><label>Adresse<input value={fields.address} onChange={(event) => setField('address', event.target.value)} placeholder="Adresse complète" /></label></div><div><label>Service *<select value={fields.service_id} onChange={(event) => setField('service_id', event.target.value)} required><option value="">{services.length ? 'Choisir un service' : 'Chargement des services…'}</option>{services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}</select>{error('service_id') && <small className="bwd-field-error">{error('service_id')}</small>}</label></div><div><label>Surface ou quantité *<input type="number" min="0.01" step="0.01" value={fields.quantity} onChange={(event) => setField('quantity', event.target.value)} placeholder="Ex. 20" required />{error('quantity') && <small className="bwd-field-error">{error('quantity')}</small>}</label><label>Dimensions<input value={fields.dimensions} onChange={(event) => setField('dimensions', event.target.value)} placeholder="Ex. 2 m × 3 m" /></label></div><div><label>Budget envisagé (DT)<input type="number" min="0" value={fields.approximate_budget} onChange={(event) => setField('approximate_budget', event.target.value)} placeholder="Ex. 500" /></label><label>Type spécifique<input value={fields.service_type} onChange={(event) => setField('service_type', event.target.value)} placeholder="Ex. Miroir biseauté" /></label></div><label>Décrivez votre projet *<textarea value={fields.description} onChange={(event) => setField('description', event.target.value)} rows={5} placeholder="Dimensions, style souhaité, matériaux, détails…" required />{error('description') && <small className="bwd-field-error">{error('description')}</small>}</label><label>Photos du projet (facultatif, 5 maximum)<input className="bwd-file-input" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => setPhotos(Array.from(event.target.files ?? []).slice(0, 5))} /><small>{photos.length ? `${photos.length} photo(s) sélectionnée(s)` : 'JPG, PNG ou WebP — 5 Mo maximum par photo.'}</small></label>{estimate && <aside className="bwd-estimate"><p>Estimation indicative</p><strong>{price(estimate.estimated_min)} — {price(estimate.estimated_max)} {estimate.currency}</strong><small>{estimate.note}</small></aside>}{errors.form?.[0] && <p className="bwd-form-error">{errors.form[0]}</p>}{successMessage && <p className="bwd-form-success">{successMessage}</p>}<div className="bwd-form-actions"><button type="button" className="bwd-outline-button" onClick={calculateEstimate} disabled={loadingEstimate}>{loadingEstimate ? 'Calcul en cours…' : 'Calculer mon estimation'}</button><button type="submit" className="bwd-dark-button" disabled={sending}>{sending ? 'Envoi en cours…' : 'Envoyer ma demande'}</button></div></form></div></Page> }
function AppointmentPage() { return <Page variant="bwd-appointment-page" title="Prendre rendez-vous" subtitle="Choisissez une visite sur place ou un échange gratuit via WhatsApp ou Zoom."><div className="bwd-form-layout"><div className="bwd-note"><strong>Visite sur place :</strong> payante, tarif confirmé par l’entreprise.<br /><br /><strong>WhatsApp ou Zoom :</strong> échange à distance gratuit.</div><form className="bwd-form"><label>Nom complet<input placeholder="Votre nom" /></label><label>Téléphone<input placeholder="XX XXX XXX" /></label><label>Type de rendez-vous<select defaultValue=""><option value="" disabled>Choisir</option><option>Visite sur place — payante</option><option>WhatsApp — gratuit</option><option>Zoom — gratuit</option></select></label><label>Date souhaitée<input type="datetime-local" /></label><label>Informations complémentaires<textarea rows={4} placeholder="Votre projet, adresse ou détails…" /></label><button type="button" className="bwd-dark-button">Envoyer ma demande</button></form></div></Page> }
function ContactPage() { return <Page variant="bwd-contact-page" title="Parlons de votre projet" subtitle="Notre équipe est à votre écoute pour répondre à vos questions."><div className="bwd-form-layout"><div className="bwd-contact"><p>☎ +216 XX XXX XXX</p><p>✉ contact@benwadadeco.com</p><p>⌖ Tunisie</p></div><form className="bwd-form"><label>Nom complet<input placeholder="Votre nom" /></label><label>E-mail<input type="email" placeholder="vous@email.com" /></label><label>Sujet<input placeholder="Votre demande" /></label><label>Message<textarea rows={6} placeholder="Écrivez votre message…" /></label><button type="button" className="bwd-dark-button">Envoyer le message</button></form></div></Page> }
type DashboardStats = { quote_requests: { total: number; new: number; contacted: number }; appointments: { total: number; requested: number; confirmed: number }; quotes: { total: number; draft: number; sent: number; accepted: number; accepted_total_tnd: number }; projects: { total: number; planning: number; in_progress: number; installation: number; completed: number } }
type AdminQuoteRequestImage = { id: number; original_name: string; mime_type: string; size: number; download_url: string }
type AdminQuoteRequest = { id: number; first_name: string; last_name: string; phone: string; email: string | null; city: string | null; address: string | null; service_type: string | null; quantity: string | number; unit: string | null; estimated_min: string | number | null; estimated_max: string | number | null; description: string; dimensions?: string | null; approximate_budget?: string | number | null; status: string; created_at: string | null; service?: { title: string }; images?: AdminQuoteRequestImage[] }
type AdminAppointment = { id: number; first_name: string; last_name: string; phone: string; email: string | null; appointment_type: string; appointment_mode: string; remote_platform: string | null; scheduled_at: string | null; status: string; notes: string | null }
type AdminQuote = { id: number; quote_number: string; quote_request_id: number | null; status: string; total: string | number; currency: string; created_at: string | null; quote_request?: { id: number; first_name: string; last_name: string } | null }
type AdminProject = { id: number; quote_id: number; title: string; status: string; start_date: string | null; expected_completion_date: string | null; quote?: { quote_number: string } }

function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('bwd_admin_token') ?? '')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${apiUrl}/login`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.errors?.email?.[0] ?? 'Identifiants administrateur invalides.')
      localStorage.setItem('bwd_admin_token', data.token)
      setToken(data.token)
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Connexion impossible.')
    } finally {
      setLoading(false)
    }
  }

  if (token) return <AdminWorkspace token={token} logout={() => { localStorage.removeItem('bwd_admin_token'); setToken('') }} />

  return <main className="bwd-admin-page"><section className="bwd-admin-login"><p className="bwd-eyebrow">Espace professionnel</p><h1>Connexion admin</h1><p>Accédez aux demandes, rendez-vous, devis et projets.</p><form className="bwd-admin-form" onSubmit={login}><label>E-mail<input type="email" value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} required /></label><label>Mot de passe<input type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} required /></label>{error && <p className="bwd-admin-error">{error}</p>}<button className="bwd-dark-button" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'}</button><Link to="/">← Retour au site</Link></form></section></main>
}

function AdminWorkspace({ token, logout }: { token: string; logout: () => void }) {
  const [tab, setTab] = useState<'dashboard' | 'requests' | 'appointments' | 'quotes' | 'projects' | 'pricing'>('dashboard')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [requests, setRequests] = useState<AdminQuoteRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<AdminQuoteRequest | null>(null)
  const [requestImageUrls, setRequestImageUrls] = useState<string[]>([])
  const [appointments, setAppointments] = useState<AdminAppointment[]>([])
  const [quotes, setQuotes] = useState<AdminQuote[]>([])
  const [quoteSearch, setQuoteSearch] = useState('')
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [quoteRequest, setQuoteRequest] = useState<AdminQuoteRequest | null>(null)
  const [quoteForm, setQuoteForm] = useState({ label: '', quantity: '1', unit: 'pièce', unit_price: '', valid_until: '', notes: '' })
  const [appointmentRequest, setAppointmentRequest] = useState<AdminQuoteRequest | null>(null)
  const [appointmentForm, setAppointmentForm] = useState({ mode: 'on_site', platform: 'whatsapp', scheduled_at: '', city: '', address: '', notes: '' })
  const [projectQuote, setProjectQuote] = useState<AdminQuote | null>(null)
  const [projectTitle, setProjectTitle] = useState('')
  const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` }
  const money = (value: string | number | null | undefined) => new Intl.NumberFormat('fr-TN', { maximumFractionDigits: 3 }).format(Number(value ?? 0))
  const date = (value: string | null) => value ? new Intl.DateTimeFormat('fr-TN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—'
  const filteredQuotes = quotes.filter((quote) => `${quote.quote_number} ${quote.quote_request?.first_name ?? ''} ${quote.quote_request?.last_name ?? ''}`.toLocaleLowerCase('fr').includes(quoteSearch.trim().toLocaleLowerCase('fr')))

  const load = async () => {
    setBusy(true)
    setError('')
    try {
      const endpoints = ['dashboard', 'quote-requests', 'appointments', 'quotes', 'projects']
      const responses = await Promise.all(endpoints.map((endpoint) => fetch(`${apiUrl}/admin/${endpoint}`, { headers })))
      if (responses.some((response) => response.status === 401)) { logout(); return }
      if (responses.some((response) => !response.ok)) throw new Error('Impossible de charger le dashboard.')
      const [dashboard, quoteRequests, appointmentData, quoteData, projectData] = await Promise.all(responses.map((response) => response.json()))
      setStats(dashboard.data)
      setRequests(quoteRequests.data ?? [])
      setAppointments(appointmentData.data ?? [])
      setQuotes(quoteData.data ?? [])
      setProjects(projectData.data ?? [])
    } catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'Une erreur est survenue.') } finally { setBusy(false) }
  }

  useEffect(() => { void load() }, [])

  useEffect(() => {
    const objectUrls: string[] = []
    let active = true

    const loadImages = async () => {
      if (!selectedRequest?.images?.length) { setRequestImageUrls([]); return }
      const urls = await Promise.all(selectedRequest.images.map(async (image) => {
        const response = await fetch(image.download_url, { headers })
        if (!response.ok) return null
        const url = URL.createObjectURL(await response.blob())
        objectUrls.push(url)
        return url
      }))
      if (active) setRequestImageUrls(urls.filter((url): url is string => Boolean(url)))
    }

    void loadImages()
    return () => { active = false; objectUrls.forEach((url) => URL.revokeObjectURL(url)) }
  }, [selectedRequest, token])

  const update = async (path: string, payload: object, success: string) => {
    setBusy(true); setError(''); setNotice('')
    const status = (payload as { status?: string }).status
    const id = Number(path.split('/').at(-1))
    if (status) {
      if (path.startsWith('quote-requests/')) setRequests((current) => current.map((item) => item.id === id ? { ...item, status } : item))
      if (path.startsWith('appointments/')) setAppointments((current) => current.map((item) => item.id === id ? { ...item, status } : item))
      if (path.startsWith('quotes/')) setQuotes((current) => current.map((item) => item.id === id ? { ...item, status } : item))
      if (path.startsWith('projects/')) setProjects((current) => current.map((item) => item.id === id ? { ...item, status } : item))
    }
    try {
      const response = await fetch(`${apiUrl}/admin/${path}`, { method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message ?? 'Mise à jour impossible.')
      setNotice(success)
      void load()
    } catch (updateError) { setError(updateError instanceof Error ? updateError.message : 'Mise à jour impossible.'); void load() } finally { setBusy(false) }
  }

  const openQuote = (request: AdminQuoteRequest) => {
    setQuoteRequest(request)
    const estimatedAverage = (Number(request.estimated_min ?? 0) + Number(request.estimated_max ?? 0)) / 2
    setQuoteForm({ label: request.service?.title ?? 'Prestation Ben Wada Déco', quantity: String(request.quantity || 1), unit: request.unit || 'pièce', unit_price: String(estimatedAverage && request.quantity ? estimatedAverage / Number(request.quantity) : 0), valid_until: '', notes: '' })
    setTab('quotes')
  }

  const openAppointment = (request: AdminQuoteRequest) => {
    setAppointmentRequest(request)
    setAppointmentForm({ mode: 'on_site', platform: 'whatsapp', scheduled_at: '', city: request.city ?? '', address: request.address ?? '', notes: '' })
  }

  const createAppointment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!appointmentRequest) return
    setBusy(true); setError(''); setNotice('')
    try {
      const payload = {
        quote_request_id: appointmentRequest.id,
        first_name: appointmentRequest.first_name,
        last_name: appointmentRequest.last_name,
        phone: appointmentRequest.phone,
        email: appointmentRequest.email || null,
        city: appointmentForm.mode === 'on_site' ? appointmentForm.city : null,
        address: appointmentForm.mode === 'on_site' ? appointmentForm.address : null,
        appointment_type: 'visit',
        appointment_mode: appointmentForm.mode,
        remote_platform: appointmentForm.mode === 'remote' ? appointmentForm.platform : null,
        scheduled_at: appointmentForm.scheduled_at,
        status: 'confirmed',
        notes: appointmentForm.notes || null,
      }
      const response = await fetch(`${apiUrl}/admin/appointments`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message ?? 'Création du rendez-vous impossible.')
      setAppointmentRequest(null); setNotice('Rendez-vous créé et confirmé.'); setTab('appointments'); await load()
    } catch (appointmentError) { setError(appointmentError instanceof Error ? appointmentError.message : 'Création du rendez-vous impossible.') } finally { setBusy(false) }
  }

  const createQuote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!quoteRequest) return
    setBusy(true); setError(''); setNotice('')
    try {
      const payload = { quote_request_id: quoteRequest.id, items: [{ label: quoteForm.label, quantity: Number(quoteForm.quantity), unit: quoteForm.unit, unit_price: Number(quoteForm.unit_price) }], valid_until: quoteForm.valid_until || null, notes: quoteForm.notes || null }
      const response = await fetch(`${apiUrl}/admin/quotes`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message ?? 'Création du devis impossible.')
      setQuoteRequest(null); setNotice('Devis créé. Vous pouvez maintenant le télécharger en PDF ou le marquer comme envoyé.'); await load()
    } catch (quoteError) { setError(quoteError instanceof Error ? quoteError.message : 'Création du devis impossible.') } finally { setBusy(false) }
  }

  const downloadPdf = async (quote: AdminQuote) => {
    setBusy(true); setError('')
    try {
      const response = await fetch(`${apiUrl}/admin/quotes/${quote.id}/pdf`, { headers })
      if (!response.ok) throw new Error('Impossible de générer le PDF.')
      const link = document.createElement('a'); link.href = URL.createObjectURL(await response.blob()); link.download = `devis-${quote.quote_number}.pdf`; link.click(); URL.revokeObjectURL(link.href)
    } catch (pdfError) { setError(pdfError instanceof Error ? pdfError.message : 'Téléchargement impossible.') } finally { setBusy(false) }
  }

  const createProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!projectQuote) return
    setBusy(true); setError(''); setNotice('')
    try {
      const response = await fetch(`${apiUrl}/admin/quotes/${projectQuote.id}/project`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ title: projectTitle || `Projet ${projectQuote.quote_number}` }) })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message ?? 'Création du projet impossible.')
      setProjectQuote(null); setProjectTitle(''); setNotice('Projet créé. Toute progression de son statut enverra un e-mail au client.'); await load()
    } catch (projectError) { setError(projectError instanceof Error ? projectError.message : 'Création du projet impossible.') } finally { setBusy(false) }
  }

  const menu = [['dashboard', 'Dashboard'], ['requests', 'Demandes de devis'], ['appointments', 'Rendez-vous'], ['quotes', 'Devis PDF'], ['projects', 'Projets'], ['pricing', 'Règles de prix']] as const
  return <main className="bwd-admin-page"><div className="bwd-admin-shell bwd-admin-app"><aside className="bwd-admin-sidebar"><Link to="/" className="bwd-admin-logo">Ben Wada<br />Déco</Link><p>Administration</p><nav>{menu.map(([key, label]) => <button key={key} onClick={() => setTab(key)} className={tab === key ? 'active' : ''}>{label}</button>)}</nav><button className="bwd-admin-logout" onClick={logout}>Déconnexion</button></aside><section className="bwd-admin-content"><header className="bwd-admin-header"><div><p className="bwd-eyebrow">Espace professionnel</p><h1>{menu.find(([key]) => key === tab)?.[1]}</h1></div><button type="button" className="bwd-outline-button" onClick={() => void load()} disabled={busy}>Actualiser</button></header>{error && <p className="bwd-admin-error">{error}</p>}{notice && <p className="bwd-form-success">{notice}</p>}
    {tab === 'dashboard' && <section><div className="bwd-stat-grid"><article><span>Nouvelles demandes</span><strong>{stats?.quote_requests.new ?? '—'}</strong><small>{stats?.quote_requests.total ?? 0} au total</small></article><article><span>RDV à confirmer</span><strong>{stats?.appointments.requested ?? '—'}</strong><small>{stats?.appointments.confirmed ?? 0} confirmés</small></article><article><span>Devis envoyés</span><strong>{stats?.quotes.sent ?? '—'}</strong><small>{stats?.quotes.accepted ?? 0} acceptés</small></article><article><span>Projets en cours</span><strong>{(stats?.projects.planning ?? 0) + (stats?.projects.in_progress ?? 0) + (stats?.projects.installation ?? 0)}</strong><small>{stats?.projects.completed ?? 0} terminés</small></article></div><div className="bwd-admin-dashboard-grid"><article className="bwd-admin-panel"><h2>Activité récente</h2><p><strong>{requests.length}</strong> demande(s) de devis reçue(s)</p><p><strong>{appointments.length}</strong> rendez-vous enregistré(s)</p><p><strong>{projects.length}</strong> projet(s) suivi(s)</p></article><article className="bwd-admin-panel"><h2>Suivi client par e-mail</h2><p>Lorsqu’un projet passe à « En préparation », « En cours », « Installation », « Terminé » ou « Annulé », Laravel envoie automatiquement un e-mail au client.</p><button className="bwd-dark-button" onClick={() => setTab('projects')}>Gérer les projets</button></article></div></section>}
    {tab === 'requests' && <section>{appointmentRequest && <form className="bwd-admin-form bwd-admin-quote-form" onSubmit={createAppointment}><div className="bwd-admin-form-title"><div><h2>Créer un rendez-vous</h2><small>{appointmentRequest.first_name} {appointmentRequest.last_name} · {appointmentRequest.phone}</small></div><button type="button" onClick={() => setAppointmentRequest(null)}>Annuler</button></div><div><label>Mode de rendez-vous<select value={appointmentForm.mode} onChange={(event) => setAppointmentForm({ ...appointmentForm, mode: event.target.value })}><option value="on_site">Visite sur place — payante</option><option value="remote">À distance — gratuit</option></select></label>{appointmentForm.mode === 'remote' ? <label>Plateforme<select value={appointmentForm.platform} onChange={(event) => setAppointmentForm({ ...appointmentForm, platform: event.target.value })}><option value="whatsapp">WhatsApp — gratuit</option><option value="zoom">Zoom — gratuit</option></select></label> : <label>Ville<input value={appointmentForm.city} onChange={(event) => setAppointmentForm({ ...appointmentForm, city: event.target.value })} required /></label>}</div>{appointmentForm.mode === 'on_site' && <label>Adresse de la visite<input value={appointmentForm.address} onChange={(event) => setAppointmentForm({ ...appointmentForm, address: event.target.value })} required /></label>}<label>Date et heure<input type="datetime-local" value={appointmentForm.scheduled_at} onChange={(event) => setAppointmentForm({ ...appointmentForm, scheduled_at: event.target.value })} required /></label><label>Notes pour le rendez-vous<textarea value={appointmentForm.notes} onChange={(event) => setAppointmentForm({ ...appointmentForm, notes: event.target.value })} placeholder="Dimensions à confirmer, matériaux souhaités, contraintes…" /></label><p className="bwd-admin-email-note">La visite sur place est indiquée comme payante. WhatsApp et Zoom sont gratuits.</p><button className="bwd-dark-button" disabled={busy}>Créer et confirmer le rendez-vous</button></form>}{selectedRequest ? <section className="bwd-admin-panel bwd-request-detail"><button className="bwd-back-button" onClick={() => { setSelectedRequest(null); setAppointmentRequest(null) }}>← Toutes les demandes</button><div className="bwd-request-detail-head"><div><p className="bwd-eyebrow">Demande #{selectedRequest.id}</p><h2>{selectedRequest.first_name} {selectedRequest.last_name}</h2></div><select className={`bwd-status bwd-status-${selectedRequest.status}`} value={selectedRequest.status} onChange={(event) => { const status = event.target.value; setSelectedRequest({ ...selectedRequest, status }); void update(`quote-requests/${selectedRequest.id}`, { status }, 'Statut de la demande mis à jour.') }}><option value="new">Nouvelle</option><option value="contacted">Client contacté</option></select></div><div className="bwd-request-detail-grid"><article><h3>Coordonnées</h3><p><strong>Téléphone</strong>{selectedRequest.phone}</p><p><strong>E-mail</strong>{selectedRequest.email ?? 'Non renseigné'}</p><p><strong>Ville</strong>{selectedRequest.city ?? 'Non renseignée'}</p><p><strong>Adresse</strong>{selectedRequest.address ?? 'Non renseignée'}</p></article><article><h3>Projet demandé</h3><p><strong>Service</strong>{selectedRequest.service?.title ?? 'Non renseigné'}</p><p><strong>Quantité</strong>{selectedRequest.quantity} {selectedRequest.unit ?? ''}</p><p><strong>Dimensions</strong>{selectedRequest.dimensions ?? 'Non renseignées'}</p><p><strong>Budget envisagé</strong>{selectedRequest.approximate_budget ? `${money(selectedRequest.approximate_budget)} DT` : 'Non renseigné'}</p></article></div><article className="bwd-request-description"><h3>Description du client</h3><p>{selectedRequest.description}</p></article>{requestImageUrls.length > 0 && <section className="bwd-request-images"><h3>Photos envoyées</h3><div>{requestImageUrls.map((url, index) => <a key={url} href={url} target="_blank" rel="noreferrer"><img src={url} alt={`Photo du projet ${index + 1}`} /></a>)}</div></section>}<div className="bwd-request-detail-actions"><button onClick={() => openAppointment(selectedRequest)}>Créer un rendez-vous</button>{selectedRequest.status === 'contacted' && <button className="bwd-dark-button bwd-create-quote-button" onClick={() => openQuote(selectedRequest)}>Créer le devis</button>}<small>Contactez le client, puis passez le statut à « Client contacté » pour créer son devis final.</small></div></section> : <section className="bwd-admin-panel"><h2>Demandes reçues</h2><p>Ouvrez une demande pour consulter les informations complètes du client et préparer la suite.</p><div className="bwd-admin-list">{requests.map((request) => <article key={request.id}><div><strong>{request.first_name} {request.last_name}</strong><span>{request.service?.title ?? 'Service'} · {request.quantity} {request.unit ?? ''}</span><small>{request.phone} · {date(request.created_at)}</small></div><div className="bwd-admin-actions"><button onClick={() => setSelectedRequest(request)}>Voir la demande</button></div></article>)}</div>{!requests.length && <p>Aucune demande pour le moment.</p>}</section>}</section>}
    {tab === 'appointments' && <section className="bwd-admin-panel"><h2>Rendez-vous</h2><div className="bwd-admin-list">{appointments.map((appointment) => <article key={appointment.id}><div><strong>{appointment.first_name} {appointment.last_name}</strong><span>{appointment.appointment_mode === 'on_site' ? 'Visite sur place — payante' : `${appointment.remote_platform ?? 'À distance'} — gratuit`}</span><p>{date(appointment.scheduled_at)}</p><small>{appointment.phone} · {appointment.email ?? 'Sans e-mail'}</small></div><div className="bwd-admin-actions"><select className={`bwd-status bwd-status-${appointment.status}`} value={appointment.status} onChange={(event) => void update(`appointments/${appointment.id}`, { status: event.target.value }, 'Statut du rendez-vous mis à jour.')}><option value="requested">À confirmer</option><option value="confirmed">Confirmé</option><option value="completed">Terminé</option><option value="cancelled">Annulé</option></select></div></article>)}</div>{!appointments.length && <p>Aucun rendez-vous pour le moment.</p>}</section>}
    {tab === 'quotes' && <section>{quoteRequest && <form className="bwd-admin-form bwd-admin-quote-form" onSubmit={createQuote}><div className="bwd-admin-form-title"><h2>Créer le devis pour {quoteRequest.first_name} {quoteRequest.last_name}</h2><button type="button" onClick={() => setQuoteRequest(null)}>Annuler</button></div><div><label>Prestation<input value={quoteForm.label} onChange={(event) => setQuoteForm({ ...quoteForm, label: event.target.value })} required /></label><label>Quantité<input type="number" min="0.01" step="0.01" value={quoteForm.quantity} onChange={(event) => setQuoteForm({ ...quoteForm, quantity: event.target.value })} required /></label></div><div><label>Unité<input value={quoteForm.unit} onChange={(event) => setQuoteForm({ ...quoteForm, unit: event.target.value })} /></label><label>Prix unitaire (DT)<input type="number" min="0" step="0.001" value={quoteForm.unit_price} onChange={(event) => setQuoteForm({ ...quoteForm, unit_price: event.target.value })} required /></label></div><label>Valide jusqu’au<input type="date" value={quoteForm.valid_until} onChange={(event) => setQuoteForm({ ...quoteForm, valid_until: event.target.value })} /></label><label>Notes<textarea value={quoteForm.notes} onChange={(event) => setQuoteForm({ ...quoteForm, notes: event.target.value })} /></label><button className="bwd-dark-button" disabled={busy}>Créer le devis</button></form>}<section className="bwd-admin-panel"><h2>Devis finaux</h2><p>En passant un devis à « Envoyé », son PDF est expédié automatiquement par e-mail au client.</p><input className="bwd-admin-search" value={quoteSearch} onChange={(event) => setQuoteSearch(event.target.value)} placeholder="Rechercher par nom ou numéro de devis…" aria-label="Rechercher un devis" /><div className="bwd-admin-list">{filteredQuotes.map((quote) => <article key={quote.id}><div><strong>{quote.quote_number}</strong><span>{quote.quote_request ? `${quote.quote_request.first_name} ${quote.quote_request.last_name}` : 'Client non renseigné'} · {money(quote.total)} {quote.currency}</span><small>Statut : {quote.status}</small></div><div className="bwd-admin-actions">{quote.status === 'draft' ? <button className="bwd-send-quote-button" onClick={() => void update(`quotes/${quote.id}`, { status: 'sent' }, 'Le devis PDF a été envoyé par e-mail au client si son adresse est renseignée.')}>✉ Envoyer le devis</button> : <select className={`bwd-status bwd-status-${quote.status}`} value={quote.status} onChange={(event) => void update(`quotes/${quote.id}`, { status: event.target.value }, 'Statut du devis mis à jour.')}><option value="sent">Envoyé</option><option value="accepted">Accepté</option><option value="rejected">Refusé</option></select>}<button onClick={() => void downloadPdf(quote)}>PDF</button>{quote.status === 'accepted' && <button className="bwd-dark-button" onClick={() => { setProjectQuote(quote); setProjectTitle(`Projet ${quote.quote_number}`); setTab('projects') }}>Créer projet</button>}</div></article>)}</div>{!quotes.length && <p>Créez un devis depuis une demande reçue.</p>}{quotes.length > 0 && !filteredQuotes.length && <p>Aucun devis ne correspond à cette recherche.</p>}</section></section>}
    {tab === 'projects' && <section>{projectQuote && <form className="bwd-admin-form bwd-admin-quote-form" onSubmit={createProject}><div className="bwd-admin-form-title"><h2>Créer un projet</h2><button type="button" onClick={() => setProjectQuote(null)}>Annuler</button></div><label>Nom du projet<input value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)} required /></label><p className="bwd-admin-email-note">Le client recevra automatiquement un e-mail lors de chaque changement de statut.</p><button className="bwd-dark-button" disabled={busy}>Créer le projet</button></form>}<section className="bwd-admin-panel"><h2>Suivi des projets</h2><div className="bwd-admin-list">{projects.map((project) => <article key={project.id}><div><strong>{project.title}</strong><span>{project.quote?.quote_number ?? 'Devis'}</span><small>Début : {project.start_date ?? 'Non défini'} · Fin prévue : {project.expected_completion_date ?? 'Non définie'}</small></div><div className="bwd-admin-actions"><select className={`bwd-status bwd-status-${project.status}`} value={project.status} onChange={(event) => void update(`projects/${project.id}`, { status: event.target.value }, 'Statut mis à jour : l’e-mail de progression a été envoyé au client si son adresse est renseignée.')}><option value="planning">En préparation</option><option value="in_progress">En cours</option><option value="installation">Installation</option><option value="completed">Terminé</option><option value="cancelled">Annulé</option></select></div></article>)}</div>{!projects.length && <p>Un projet peut être créé après l’acceptation d’un devis.</p>}</section></section>}
    {tab === 'pricing' && <PricingRulesPanel token={token} />}
  </section></div></main>
}

function PricingRulesPanel({ token }: { token: string }) {
  const [rules, setRules] = useState<PricingRule[]>([])
  const [services, setServices] = useState<PublicApiService[]>([])
  const [form, setForm] = useState<PricingRuleForm>(emptyPricingRuleForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` }
  const load = async () => { const [serviceResponse, ruleResponse] = await Promise.all([fetch(`${apiUrl}/services`), fetch(`${apiUrl}/admin/pricing-rules`, { headers })]); if (!serviceResponse.ok || !ruleResponse.ok) { setError('Impossible de charger les règles de prix.'); return }; const [serviceData, ruleData] = await Promise.all([serviceResponse.json(), ruleResponse.json()]); setServices(serviceData.data ?? []); setRules(ruleData.data ?? []) }
  useEffect(() => { void load() }, [])
  const save = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setError(''); const payload = { ...form, service_id: Number(form.service_id), reference_quantity: form.calculation_method === 'prorata' ? Number(form.reference_quantity) : null, min_price: Number(form.min_price), max_price: Number(form.max_price) }; const response = await fetch(`${apiUrl}/admin/pricing-rules`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const data = await response.json().catch(() => null); if (!response.ok) { setError(data?.message ?? 'Enregistrement impossible.'); return }; setMessage('Règle de prix enregistrée.'); setForm(emptyPricingRuleForm()); await load() }
  return <section className="bwd-admin-grid"><form className="bwd-admin-form" onSubmit={save}><h2>Configurer une règle</h2><label>Service<select value={form.service_id} onChange={(event) => setForm({ ...form, service_id: event.target.value })} required><option value="">Choisir</option>{services.map((service) => <option value={service.id} key={service.id}>{service.title}</option>)}</select></label><div><label>Unité<select value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value as PricingRuleForm['unit'] })}><option value="m2">m²</option><option value="meter">Mètre</option><option value="piece">Pièce</option></select></label><label>Formule<select value={form.calculation_method} onChange={(event) => setForm({ ...form, calculation_method: event.target.value as PricingRuleForm['calculation_method'] })}><option value="prorata">Au prorata</option><option value="per_unit">Par unité</option><option value="fixed">Prix fixe</option></select></label></div>{form.calculation_method === 'prorata' && <label>Quantité de référence<input type="number" min="0.01" value={form.reference_quantity} onChange={(event) => setForm({ ...form, reference_quantity: event.target.value })} required /></label>}<div><label>Prix min. (DT)<input type="number" min="0" value={form.min_price} onChange={(event) => setForm({ ...form, min_price: event.target.value })} required /></label><label>Prix max. (DT)<input type="number" min="0" value={form.max_price} onChange={(event) => setForm({ ...form, max_price: event.target.value })} required /></label></div>{error && <p className="bwd-admin-error">{error}</p>}{message && <p className="bwd-form-success">{message}</p>}<button className="bwd-dark-button">Enregistrer</button></form><section className="bwd-admin-panel"><h2>Règles actives</h2><div className="bwd-admin-list">{rules.map((rule) => <article key={rule.id}><div><strong>{rule.service?.title}</strong><span>{rule.min_price} — {rule.max_price} DT</span><small>{rule.calculation_method} · {rule.unit}</small></div></article>)}</div></section></section>
}

export function PricingRulesLegacyPage() {
  const [token, setToken] = useState(() => localStorage.getItem('bwd_admin_token') ?? '')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState<PublicApiService[]>([])
  const [rules, setRules] = useState<PricingRule[]>([])
  const [form, setForm] = useState<PricingRuleForm>(emptyPricingRuleForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const authHeaders = () => ({ Accept: 'application/json', Authorization: `Bearer ${token}` })
  const loadDashboard = async () => {
    setLoading(true)
    setError('')
    try {
      const [servicesResponse, rulesResponse] = await Promise.all([
        fetch(`${apiUrl}/services`),
        fetch(`${apiUrl}/admin/pricing-rules`, { headers: authHeaders() }),
      ])
      if (rulesResponse.status === 401) throw new Error('Votre session a expiré. Connectez-vous de nouveau.')
      if (!servicesResponse.ok || !rulesResponse.ok) throw new Error('Impossible de charger les données du dashboard.')
      const [servicesData, rulesData] = await Promise.all([servicesResponse.json(), rulesResponse.json()])
      setServices(servicesData.data ?? [])
      setRules(rulesData.data ?? [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (token) void loadDashboard() }, [token])

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setLoginError('')
    try {
      const response = await fetch(`${apiUrl}/login`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.errors?.email?.[0] ?? data?.message ?? 'Connexion impossible.')
      localStorage.setItem('bwd_admin_token', data.token)
      setToken(data.token)
    } catch (loginFailure) {
      setLoginError(loginFailure instanceof Error ? loginFailure.message : 'Connexion impossible.')
    } finally {
      setLoading(false)
    }
  }

  const saveRule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    const payload = { ...form, service_id: Number(form.service_id), reference_quantity: form.calculation_method === 'prorata' ? Number(form.reference_quantity) : null, min_price: Number(form.min_price), max_price: Number(form.max_price) }
    try {
      const response = await fetch(editingId ? `${apiUrl}/admin/pricing-rules/${editingId}` : `${apiUrl}/admin/pricing-rules`, { method: editingId ? 'PATCH' : 'POST', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message ?? 'Impossible d’enregistrer cette règle.')
      setForm(emptyPricingRuleForm())
      setEditingId(null)
      setMessage('Règle de prix enregistrée.')
      await loadDashboard()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const editRule = (rule: PricingRule) => {
    setEditingId(rule.id)
    setForm({ service_id: String(rule.service_id), unit: rule.unit, calculation_method: rule.calculation_method, reference_quantity: String(rule.reference_quantity ?? ''), min_price: String(rule.min_price), max_price: String(rule.max_price), is_active: rule.is_active })
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const logout = async () => {
    try { await fetch(`${apiUrl}/logout`, { method: 'POST', headers: authHeaders() }) } finally {
      localStorage.removeItem('bwd_admin_token')
      setToken('')
      setRules([])
    }
  }

  if (!token) return <main className="bwd-admin-page"><section className="bwd-admin-login"><p className="bwd-eyebrow">Espace professionnel</p><h1>Connexion admin</h1><p>Accédez aux demandes et à la configuration des estimations.</p><form className="bwd-admin-form" onSubmit={login}><label>E-mail<input type="email" value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} required /></label><label>Mot de passe<input type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} required /></label>{loginError && <p className="bwd-admin-error">{loginError}</p>}<button className="bwd-dark-button" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'}</button><Link to="/">← Retour au site</Link></form></section></main>

  return <main className="bwd-admin-page"><div className="bwd-admin-shell"><header className="bwd-admin-header"><div><p className="bwd-eyebrow">Ben Wada Déco · Administration</p><h1>Règles de prix</h1></div><button type="button" className="bwd-outline-button" onClick={logout}>Déconnexion</button></header><p className="bwd-admin-intro">Configurez la formule, l’unité et l’intervalle d’estimation affiché au client. Il y a une seule règle active par service.</p>{error && <p className="bwd-admin-error">{error}</p>}{message && <p className="bwd-form-success">{message}</p>}<section className="bwd-admin-grid"><form className="bwd-admin-form bwd-admin-rule-form" onSubmit={saveRule}><div className="bwd-admin-form-title"><h2>{editingId ? 'Modifier la règle' : 'Configurer une règle'}</h2>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyPricingRuleForm()) }}>Annuler</button>}</div><label>Service *<select value={form.service_id} onChange={(event) => setForm({ ...form, service_id: event.target.value })} required><option value="">Choisir un service</option>{services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}</select></label><div><label>Unité *<select value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value as PricingRuleForm['unit'] })}><option value="m2">m²</option><option value="meter">Mètre</option><option value="piece">Pièce</option></select></label><label>Formule *<select value={form.calculation_method} onChange={(event) => setForm({ ...form, calculation_method: event.target.value as PricingRuleForm['calculation_method'] })}><option value="prorata">Au prorata</option><option value="per_unit">Par unité</option><option value="fixed">Prix fixe</option></select></label></div>{form.calculation_method === 'prorata' && <label>Quantité de référence *<input type="number" min="0.01" step="0.01" value={form.reference_quantity} onChange={(event) => setForm({ ...form, reference_quantity: event.target.value })} required /><small>Ex. 100 m² pour un prix défini par 100 m².</small></label>}<div><label>Prix minimum (DT) *<input type="number" min="0" step="0.001" value={form.min_price} onChange={(event) => setForm({ ...form, min_price: event.target.value })} required /></label><label>Prix maximum (DT) *<input type="number" min="0" step="0.001" value={form.max_price} onChange={(event) => setForm({ ...form, max_price: event.target.value })} required /></label></div><label className="bwd-admin-checkbox"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /> Règle active</label><button className="bwd-dark-button" disabled={loading}>{loading ? 'Enregistrement…' : editingId ? 'Mettre à jour' : 'Enregistrer la règle'}</button></form><section className="bwd-admin-rules"><div className="bwd-admin-form-title"><h2>Règles actives</h2><button type="button" onClick={() => void loadDashboard()} disabled={loading}>Actualiser</button></div>{loading && !rules.length ? <p>Chargement…</p> : rules.length ? <div className="bwd-admin-rule-list">{rules.map((rule) => <article key={rule.id}><div><p>{rule.service?.title ?? 'Service'}</p><strong>{Number(rule.min_price)} — {Number(rule.max_price)} DT</strong><span>{rule.calculation_method === 'prorata' ? `Au prorata / ${rule.reference_quantity} ${rule.unit === 'm2' ? 'm²' : rule.unit}` : rule.calculation_method === 'per_unit' ? `Par ${rule.unit === 'm2' ? 'm²' : rule.unit}` : 'Prix fixe'} · Active</span></div><button type="button" onClick={() => editRule(rule)}>Modifier</button></article>)}</div> : <p>Aucune règle de prix n’est encore configurée.</p>}</section></section></div></main>
}
function Page({ title, subtitle, children, variant = '' }: { title: string; subtitle: string; children: React.ReactNode; variant?: string }) { return <main className={`bwd-page ${variant}`}><div className="bwd-container"><header className="bwd-page-heading"><p className="bwd-eyebrow">Ben Wada Déco</p><h1>{title}</h1><p>{subtitle}</p></header>{children}</div></main> }
function NotFound() { return <Page title="Page introuvable" subtitle="La page demandée n’existe pas."><Link className="bwd-dark-button" to="/">Retour à l’accueil</Link></Page> }
function PublicPage({ children }: { children: React.ReactNode }) { return <><Header />{children}<Footer /></> }

export default function Website() { return <BrowserRouter><Routes><Route path="/admin/*" element={<AdminPage />} /><Route path="*" element={<PublicPage><Routes><Route path="/" element={<HomePage />} /><Route path="/services" element={<ServicesPage />} /><Route path="/services/:slug" element={<ServiceDetailPage />} /><Route path="/produits" element={<ProductsPage />} /><Route path="/produits/:slug" element={<ProductDetailPage />} /><Route path="/realisations" element={<RealisationsPage />} /><Route path="/demander-un-devis" element={<QuotePage />} /><Route path="/rendez-vous" element={<AppointmentPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<NotFound />} /></Routes></PublicPage>} /></Routes></BrowserRouter> }
