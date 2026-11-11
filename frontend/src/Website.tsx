import { useState } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Page } from "./components/Page";
import { AppointmentPage as AppointmentRoutePage } from "./pages/AppointmentPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminWorkspace } from "./pages/admin/AdminWorkspace";
import { ContactPage as ContactRoutePage } from "./pages/ContactPage";
import { HomePage as HomeRoutePage } from "./pages/HomePage";
import { ProductDetailPage as ProductDetailRoutePage, ProductsPage as ProductsRoutePage } from "./pages/ProductsPage";
import { QuoteRequestPage as QuoteRequestRoutePage } from "./pages/QuoteRequestPage";
import { RealisationPage as RealisationRoutePage } from "./pages/RealisationPage";
import { ServiceDetailPage as ServiceDetailRoutePage, ServicesPage as ServicesRoutePage } from "./pages/ServicesPage";
import { heroVideo, products, realizationImages, realizationVideos, services, trustImages } from "./data/catalog";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";
import "./website.css";
import "./styles/admin.css";
import "./styles/appointments.css";

function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem("bwd_admin_token") ?? "");

  if (token)
    return (
      <AdminWorkspace
        token={token}
        logout={() => {
          localStorage.removeItem("bwd_admin_token");
          setToken("");
        }}
      />
    );

  return <AdminLoginPage onAuthenticated={(nextToken) => { localStorage.setItem("bwd_admin_token", nextToken); setToken(nextToken); }} />;
}

function NotFound() {
  return (
    <Page title="Page introuvable" subtitle="La page demandée n’existe pas.">
      <Link className="bwd-dark-button" to="/">
        Retour à l’accueil
      </Link>
    </Page>
  );
}
function PublicPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function Website() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
        <Route
          path="*"
          element={
            <PublicPage>
              <Routes>
                <Route path="/" element={<HomeRoutePage services={services} products={products} heroVideo={heroVideo} trustImages={trustImages} />} />
                <Route path="/services" element={<ServicesRoutePage services={services} />} />
                <Route path="/services/:slug" element={<ServiceDetailRoutePage services={services} />} />
                <Route path="/produits" element={<ProductsRoutePage products={products} />} />
                <Route path="/produits/:slug" element={<ProductDetailRoutePage products={products} />} />
                <Route path="/realisations" element={<RealisationRoutePage videos={realizationVideos} images={realizationImages} />} />
                <Route path="/demander-un-devis" element={<QuoteRequestRoutePage />} />
                <Route path="/rendez-vous" element={<AppointmentRoutePage />} />
                <Route path="/contact" element={<ContactRoutePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PublicPage>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
