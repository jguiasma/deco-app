import { Page } from "../components/Page";

type RealisationPageProps = { videos: string[]; images: string[] };

export function RealisationPage({ videos, images }: RealisationPageProps) {
  return <Page variant="bwd-realisations-page" title="Nos réalisations" subtitle="Quelques projets réalisés avec passion pour nos clients.">
    <section className="bwd-realization-videos"><div className="bwd-video-grid">{videos.map((video, index) => <article key={video}><video autoPlay muted loop playsInline preload="metadata" aria-label={`Vidéo de réalisation ${index + 1}`}><source src={video} type="video/mp4" /></video></article>)}</div></section>
    <section className="bwd-realization-gallery"><p className="bwd-eyebrow">Galerie photo</p><div className="bwd-gallery">{images.map((image, index) => <img key={image} src={image} alt={`Réalisation ${index + 1}`} />)}</div></section>
  </Page>;
}
