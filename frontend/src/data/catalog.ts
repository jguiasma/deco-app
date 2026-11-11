import muralImage from "../assets/images/services/revetement-murale/IMG_8582.jpeg";
import bardageEffetBoisImage from "../assets/images/services/revetement-murale/bardage-effet-bois/E4B3A283-EFD9-4B53-84E6-B4200B729DB9.jpeg";
import decoratifImage from "../assets/images/services/revetement-murale/decoratifs/1.jpeg";
import meubleEntreeImage from "../assets/images/services/revetement-murale/meuble-entree/1.jpeg";
import separationImage from "../assets/images/services/revetement-murale/modele-separation/IMG_0446.jpeg";
import mouluresServiceImage from "../assets/images/services/revetement-murale/moulures/IMG_7294.jpeg";
import revetementMiroirImage from "../assets/images/services/revetement-murale/revetement-mirroire/1.jpeg";
import revetementTvImage from "../assets/images/services/revetement-murale/tv/1.jpeg";
import meubleImage from "../assets/images/services/meubles-sur-mesure/surmes.jpg";
import conceptionImage from "../assets/images/services/conception3d/03947e41-bb43-4546-a002-595fa4aabca7.jpeg";
import moulureImage from "../assets/images/products/moulure/IMG_7294.jpeg";
import miroirImage from "../assets/images/products/mirroire/IMG_0429.jpeg";
import bardageImage from "../assets/images/products/bardage/IMG_1465.png";
import trustOne from "../assets/images/trust/IMG_9440.jpeg";
import trustTwo from "../assets/images/trust/IMG_9428.jpeg";
import trustThree from "../assets/images/trust/IMG_7631.jpeg";
import heroVideoSix from "../assets/videos/6.mp4";
import realizationVideoOne from "../assets/videos/1.mp4";
import realizationVideoTwo from "../assets/videos/2.mp4";
import realizationVideoThree from "../assets/videos/3.mp4";
import realizationVideoFour from "../assets/videos/4.mp4";

const galleryWithCover = (cover: string, images: string[]) => [
  cover,
  ...images.filter((image) => image !== cover),
];
const serviceImageGroups = {
  revetement: Object.values(
    import.meta.glob(
      "./assets/images/services/revetement-murale/**/*.{jpeg,jpg,png}",
      { eager: true, import: "default" },
    ),
  ) as string[],
  meubles: Object.values(
    import.meta.glob(
      "./assets/images/services/meubles-sur-mesure/*.{jpeg,jpg,png}",
      { eager: true, import: "default" },
    ),
  ) as string[],
  conception: Object.values(
    import.meta.glob("./assets/images/services/conception3d/*.{jpeg,jpg,png}", {
      eager: true,
      import: "default",
    }),
  ) as string[],
};

const revetementImageGroups = {
  bardage: Object.values(import.meta.glob("./assets/images/services/revetement-murale/bardage-effet-bois/*.{jpeg,jpg,png}", { eager: true, import: "default" })) as string[],
  decoratif: Object.values(import.meta.glob("./assets/images/services/revetement-murale/decoratifs/*.{jpeg,jpg,png}", { eager: true, import: "default" })) as string[],
  meubleEntree: Object.values(import.meta.glob("./assets/images/services/revetement-murale/meuble-entree/*.{jpeg,jpg,png}", { eager: true, import: "default" })) as string[],
  separation: Object.values(import.meta.glob("./assets/images/services/revetement-murale/modele-separation/*.{jpeg,jpg,png}", { eager: true, import: "default" })) as string[],
  moulures: Object.values(import.meta.glob("./assets/images/services/revetement-murale/moulures/*.{jpeg,jpg,png}", { eager: true, import: "default" })) as string[],
  miroir: Object.values(import.meta.glob("./assets/images/services/revetement-murale/revetement-mirroire/*.{jpeg,jpg,png}", { eager: true, import: "default" })) as string[],
  tv: Object.values(import.meta.glob("./assets/images/services/revetement-murale/tv/*.{jpeg,jpg,png}", { eager: true, import: "default" })) as string[],
};

const revetementCategories = [
  { slug: "moulures", title: "Moulures", text: "Des finitions élégantes qui donnent du relief à vos murs.", image: mouluresServiceImage, gallery: galleryWithCover(mouluresServiceImage, revetementImageGroups.moulures) },
  { slug: "bardage-effet-bois", title: "Bardage effet bois", text: "Un habillage chaleureux pour structurer vos espaces.", image: bardageEffetBoisImage, gallery: galleryWithCover(bardageEffetBoisImage, revetementImageGroups.bardage) },
  { slug: "decoratif", title: "Revêtement décoratif", text: "Des textures et détails décoratifs pensés pour votre intérieur.", image: decoratifImage, gallery: galleryWithCover(decoratifImage, revetementImageGroups.decoratif) },
  { slug: "tv", title: "Revêtement TV", text: "Un mur TV moderne, pratique et harmonieux.", image: revetementTvImage, gallery: galleryWithCover(revetementTvImage, revetementImageGroups.tv) },
  { slug: "meuble-entree", title: "Revêtement meuble d’entrée", text: "Une entrée accueillante et fonctionnelle, adaptée à votre espace.", image: meubleEntreeImage, gallery: galleryWithCover(meubleEntreeImage, revetementImageGroups.meubleEntree) },
  { slug: "modele-separation", title: "Séparations décoratives", text: "Des séparations légères pour structurer une pièce avec style.", image: separationImage, gallery: galleryWithCover(separationImage, revetementImageGroups.separation) },
  { slug: "revetement-miroire", title: "Revêtement miroir", text: "Des miroirs intégrés pour agrandir et illuminer votre intérieur.", image: revetementMiroirImage, gallery: galleryWithCover(revetementMiroirImage, revetementImageGroups.miroir) },
];

export const services = [
  {
    slug: "revetement-mural",
    title: "Revêtement mural",
    text: "Moulures, bardages et habillages élégants pour structurer votre espace.",
    image: muralImage,
    gallery: galleryWithCover(muralImage, serviceImageGroups.revetement),
    categories: revetementCategories,
  },
  {
    slug: "meuble-sur-mesure",
    title: "Meuble sur mesure",
    text: "Du mobilier pensé pour vos dimensions, vos besoins et votre style.",
    image: meubleImage,
    gallery: galleryWithCover(meubleImage, serviceImageGroups.meubles),
  },
  {
    slug: "conception-3d",
    title: "Conception 3D",
    text: "Visualisez votre intérieur avant le début des travaux.",
    image: conceptionImage,
    gallery: galleryWithCover(conceptionImage, serviceImageGroups.conception),
  },
];

export const trustImages = [trustOne, trustTwo, trustThree];
const productImageGroups = {
  moulures: Object.values(
    import.meta.glob("./assets/images/products/moulure/*.{jpeg,jpg,png}", {
      eager: true,
      import: "default",
    }),
  ) as string[],
  miroirs: Object.values(
    import.meta.glob("./assets/images/products/mirroire/*.{jpeg,jpg,png}", {
      eager: true,
      import: "default",
    }),
  ) as string[],
  bardages: Object.values(
    import.meta.glob("./assets/images/products/bardage/*.{jpeg,jpg,png}", {
      eager: true,
      import: "default",
    }),
  ) as string[],
  autres: Object.values(
    import.meta.glob("./assets/images/products/autres/*.{jpeg,jpg,png}", {
      eager: true,
      import: "default",
    }),
  ) as string[],
};
export const products = [
  {
    slug: "moulures-murales",
    title: "Moulures murales",
    price: "Sur devis",
    description:
      "Des moulures décoratives élégantes pour donner du relief et du caractère à vos murs.",
    gallery: galleryWithCover(moulureImage, productImageGroups.moulures),
  },
  {
    slug: "miroir-biseaute-30x30",
    title: "Miroir biseauté 30 × 30 cm",
    price: "35 DT",
    description:
      "Un miroir biseauté raffiné, idéal pour apporter lumière et profondeur à votre intérieur.",
    gallery: galleryWithCover(miroirImage, productImageGroups.miroirs),
  },
  {
    slug: "bardage-rayure-16cm",
    title: "Bardage rayuré 16 cm",
    price: "48 DT / pièce",
    description:
      "Un bardage décoratif moderne qui structure l’espace avec des lignes élégantes.",
    gallery: galleryWithCover(bardageImage, productImageGroups.bardages),
  },
  {
    slug: "badil-chipboard",
    title: "بديل chipboard",
    price: "Sur devis",
    description:
      "Une solution décorative pratique et esthétique pour vos projets d’aménagement.",
    gallery: galleryWithCover(meubleImage, productImageGroups.autres),
  },
];
export const realizationImages = Object.values(
  import.meta.glob("./assets/images/realizations/*.{jpeg,jpg,png}", {
    eager: true,
    import: "default",
  }),
) as string[];


export const heroVideo = heroVideoSix;
export const realizationVideos = [realizationVideoOne, realizationVideoTwo, realizationVideoThree, realizationVideoFour];

