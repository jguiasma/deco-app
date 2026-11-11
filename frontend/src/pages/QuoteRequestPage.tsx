import { Calculator, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Page } from "../components/Page";
import { apiUrl } from "../services/api";

type PublicApiService = { id: number; parent_id: number | null; title: string; pricing_mode: "estimate" | "on_quote"; children?: PublicApiService[]; pricing_rule?: { unit: "m2" | "meter" | "piece"; calculation_method: "fixed" | "per_unit" | "prorata" } | null; };
type Estimate = { estimated_min?: number; estimated_max?: number; currency?: string; note: string; on_quote?: boolean; };
type ApiErrors = Record<string, string[]>;
type ProjectDraft = { fields: { first_name: string; last_name: string; phone: string; email: string; city: string; address: string; service_id: string; service_type: string; quantity: string; dimensions: string; approximate_budget: string; description: string; }; photos: File[]; estimate: Estimate; };

const findService = (services: PublicApiService[], id: number): PublicApiService | undefined => {
  for (const service of services) { if (service.id === id) return service; const child = findService(service.children ?? [], id); if (child) return child; }
};

export function QuoteRequestPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<PublicApiService[]>([]);
  const [servicePath, setServicePath] = useState<number[]>([]);
  const [fields, setFields] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    service_id: "",
    service_type: "",
    quantity: "",
    dimensions: "",
    approximate_budget: "",
    description: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<ApiErrors>({});
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  // L'estimation reste locale jusqu'à la confirmation du rendez-vous.
  const sending = false;
  const successMessage = "";
  const quoteRequestId: number | null = null;

  useEffect(() => {
    fetch(`${apiUrl}/services`)
      .then(async (response) => {
        if (!response.ok)
          throw new Error("Impossible de charger les services.");
        return response.json();
      })
      .then((data) => setServices(data.data ?? []))
      .catch((error: Error) => setErrors({ form: [error.message] }));
  }, []);

  const setField = (name: keyof typeof fields, value: string) => {
    setFields((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: [] }));
    setEstimate(null);
  };

  const responseErrors = async (response: Response): Promise<ApiErrors> => {
    const data = await response.json().catch(() => null);
    return (
      data?.errors ?? { form: [data?.message ?? "Une erreur est survenue."] }
    );
  };

  const calculateEstimate = async () => {
    if (
      !fields.service_id ||
      !fields.quantity ||
      Number(fields.quantity) <= 0
    ) {
      setErrors({
        service_id: !fields.service_id ? ["Choisissez un service."] : [],
        quantity:
          !fields.quantity || Number(fields.quantity) <= 0
            ? ["Saisissez une quantité supérieure à zéro."]
            : [],
      });
      return;
    }
    setLoadingEstimate(true);
    setErrors({});
    try {
      const response = await fetch(`${apiUrl}/estimates`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: Number(fields.service_id),
          quantity: Number(fields.quantity),
        }),
      });
      if (!response.ok) {
        setEstimate(null);
        setErrors(await responseErrors(response));
        return;
      }
      const data = await response.json();
      setEstimate(data.data);
    } catch {
      setErrors({
        form: [
          "Impossible de joindre le serveur. Vérifiez que Laravel est démarré.",
        ],
      });
    } finally {
      setLoadingEstimate(false);
    }
  };

  const submitQuote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fields.description.trim()) {
      setErrors({ description: ["Décrivez votre projet avant de continuer."] });
      return;
    }
    if (!estimate) {
      void calculateEstimate();
      return;
    }
    navigate("/rendez-vous", {
      state: {
        projectDraft: { fields, photos, estimate } satisfies ProjectDraft,
      },
    });
  };

  const error = (name: string) => errors[name]?.[0];
  const price = (value: number) =>
    new Intl.NumberFormat("fr-TN", { maximumFractionDigits: 3 }).format(value);
  const selectedLeaf = fields.service_id
    ? findService(services, Number(fields.service_id))
    : undefined;
  const selectionLevels: Array<{
    options: PublicApiService[];
    selectedId: number | undefined;
  }> = [];
  let options = services;
  let level = 0;
  while (options.length) {
    const selectedId = servicePath[level];
    selectionLevels.push({ options, selectedId });
    const selected = options.find((service) => service.id === selectedId);
    if (!selected?.children?.length) break;
    options = selected.children;
    level += 1;
  }
  if (!selectionLevels.length) {
    selectionLevels.push({ options: [], selectedId: undefined });
  }
  const quantityField = {
    m2: { label: "Surface à couvrir (m²)", placeholder: "Ex. 12,5" },
    meter: { label: "Longueur (m)", placeholder: "Ex. 5,2" },
    piece: { label: "Nombre de pièces", placeholder: "Ex. 4" },
  }[selectedLeaf?.pricing_rule?.unit ?? "piece"];

  const chooseServiceLevel = (levelIndex: number, value: string) => {
    const nextPath = [...servicePath.slice(0, levelIndex), Number(value)];
    const chosen = findService(services, Number(value));
    setServicePath(nextPath);
    setField(
      "service_id",
      chosen?.children?.length ? "" : value,
    );
  };

  return (
    <Page
      variant="bwd-quote-page"
      title="Demander un devis"
      subtitle="Décrivez votre besoin. Nous vous fournirons une estimation, puis un devis détaillé après étude."
    >
      <div className="bwd-form-layout">
        <p className="bwd-note">
          Certains travaux sur mesure dépendent de la visite, des matériaux et
          de la difficulté.
        </p>
        <form className="bwd-form" onSubmit={submitQuote} noValidate>
          <div>
            <label>
              Prénom *
              <input
                value={fields.first_name}
                onChange={(event) => setField("first_name", event.target.value)}
                placeholder="Votre prénom"
                required
              />
              {error("first_name") && (
                <small className="bwd-field-error">{error("first_name")}</small>
              )}
            </label>
            <label>
              Nom *
              <input
                value={fields.last_name}
                onChange={(event) => setField("last_name", event.target.value)}
                placeholder="Votre nom"
                required
              />
              {error("last_name") && (
                <small className="bwd-field-error">{error("last_name")}</small>
              )}
            </label>
            <label>
              Téléphone *
              <input
                value={fields.phone}
                onChange={(event) => setField("phone", event.target.value)}
                placeholder="XX XXX XXX"
                required
              />
              {error("phone") && (
                <small className="bwd-field-error">{error("phone")}</small>
              )}
            </label>
            <label>
              E-mail *
              <input
                type="email"
                value={fields.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="vous@email.com"
              />
              {error("email") && (
                <small className="bwd-field-error">{error("email")}</small>
              )}
            </label>
          </div>
          <div>
            <label>
              Ville
              <input
                value={fields.city}
                onChange={(event) => setField("city", event.target.value)}
                placeholder="Votre ville"
              />
            </label>
            <label>
              Adresse
              <input
                value={fields.address}
                onChange={(event) => setField("address", event.target.value)}
                placeholder="Adresse complète"
              />
            </label>
          </div>
          <div className="bwd-service-hierarchy">
            <div className="bwd-hierarchy-intro">
              <strong>Parlez-nous de votre projet</strong>
              <span>Choisissez votre besoin étape par étape.</span>
            </div>
            {selectionLevels.map(({ options, selectedId }, index) => {
              const previous = index > 0 ? findService(services, servicePath[index - 1]) : undefined;
              const label = index === 0
                ? "Choisissez une catégorie"
                : index === selectionLevels.length - 1
                  ? "Choisissez la prestation exacte"
                  : "Choisissez une sous-catégorie";
              const helper = index === 0
                ? "Ex. Revêtement mural ou Meuble sur mesure"
                : previous
                  ? `Parmi les options de « ${previous.title} »`
                  : "Précisez votre besoin";

              return (
                <label className="bwd-hierarchy-step" key={index}>
                  <span className="bwd-hierarchy-number">{index + 1}</span>
                  <span className="bwd-hierarchy-copy">
                    <strong>{label}</strong>
                    <small>{helper}</small>
                  </span>
                  <select
                    value={selectedId ?? ""}
                    onChange={(event) => chooseServiceLevel(index, event.target.value)}
                    required
                  >
                    <option value="">
                      {services.length ? "Sélectionner…" : "Chargement des services…"}
                    </option>
                    {options.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </label>
              );
            })}
            {selectedLeaf && (
              <p className="bwd-service-selection">
                <strong>Prestation choisie :</strong> {selectedLeaf.title}
                {selectedLeaf.pricing_mode === "on_quote"
                  ? " · Prix établi après étude"
                  : " · Estimation disponible"}
              </p>
            )}
            {error("service_id") && (
              <small className="bwd-field-error">{error("service_id")}</small>
            )}
          </div>
          <div>
            <label>
              {quantityField.label} *
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={fields.quantity}
                onChange={(event) => setField("quantity", event.target.value)}
                placeholder={quantityField.placeholder}
                required
              />
              {error("quantity") && (
                <small className="bwd-field-error">{error("quantity")}</small>
              )}
            </label>
            <label>
              Dimensions (facultatif)
              <input
                value={fields.dimensions}
                onChange={(event) => setField("dimensions", event.target.value)}
                placeholder="Ex. 2 m × 3 m — pour expliquer le projet"
              />
            </label>
          </div>
          <div>
            <label>
              Budget envisagé (DT)
              <input
                type="number"
                min="0"
                value={fields.approximate_budget}
                onChange={(event) =>
                  setField("approximate_budget", event.target.value)
                }
                placeholder="Ex. 500"
              />
            </label>
            <label>
              Type spécifique
              <input
                value={fields.service_type}
                onChange={(event) =>
                  setField("service_type", event.target.value)
                }
                placeholder="Ex. Miroir biseauté"
              />
            </label>
          </div>
          <label>
            Décrivez votre projet *
            <textarea
              value={fields.description}
              onChange={(event) => setField("description", event.target.value)}
              rows={5}
              placeholder="Dimensions, style souhaité, matériaux, détails…"
              required
            />
            {error("description") && (
              <small className="bwd-field-error">{error("description")}</small>
            )}
          </label>
          <label>
            Photos du projet (facultatif, 5 maximum)
            <input
              className="bwd-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(event) =>
                setPhotos(Array.from(event.target.files ?? []).slice(0, 5))
              }
            />
            <small>
              {photos.length
                ? `${photos.length} photo(s) sélectionnée(s)`
                : "JPG, PNG ou WebP — 5 Mo maximum par photo."}
            </small>
          </label>
          {estimate && (
            <aside className={`bwd-estimate${estimate.on_quote ? " bwd-estimate-on-quote" : ""}`}>
              {estimate.on_quote && <TriangleAlert size={28} aria-hidden="true" />}
              <p>{estimate.on_quote ? "Prestation sur devis" : "Voici votre première estimation"}</p>
              {!estimate.on_quote && (
                <strong>
                  {price(estimate.estimated_min ?? 0)} —{" "}
                  {price(estimate.estimated_max ?? 0)} {estimate.currency}
                </strong>
              )}
              <small>{estimate.note}</small>
            </aside>
          )}
          {errors.form?.[0] && (
            <p className="bwd-form-error">{errors.form[0]}</p>
          )}
          {successMessage && (
            <div className="bwd-appointment-cta">
              <p className="bwd-form-success">{successMessage}</p>
              <p>
                Confirmez les détails de votre projet lors d’un rendez-vous pour
                recevoir votre devis final.
              </p>
              {quoteRequestId && (
                <Link
                  className="bwd-dark-button"
                  to={"/rendez-vous?demande=" + quoteRequestId}
                >
                  Prendre un rendez-vous
                </Link>
              )}
            </div>
          )}
          <div className="bwd-form-actions">
            <button
              type="button"
              className="bwd-outline-button bwd-estimate-button"
              onClick={calculateEstimate}
              onMouseMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                event.currentTarget.style.setProperty(
                  "--pointer-x",
                  `${event.clientX - bounds.left}px`,
                );
                event.currentTarget.style.setProperty(
                  "--pointer-y",
                  `${event.clientY - bounds.top}px`,
                );
              }}
              disabled={loadingEstimate}
            >
              <Calculator size={16} aria-hidden="true" />
              {loadingEstimate
                ? "Calcul en cours…"
                : selectedLeaf?.pricing_mode === "on_quote"
                  ? "Voir les informations"
                  : "Calculer mon estimation"}
            </button>
            <button
              type="submit"
              className="bwd-dark-button"
              disabled={sending}
            >
              {sending ? "Envoi en cours…" : "Prendre un rendez-vous"}
            </button>
          </div>
        </form>
      </div>
    </Page>
  );
}

