import { useEffect, useState } from "react";
import { apiUrl } from "../../services/api";

type PublicApiService = { id: number; parent_id: number | null; title: string; pricing_mode: "estimate" | "on_quote"; children?: PublicApiService[]; pricing_rule?: { unit: "m2" | "meter" | "piece"; calculation_method: "fixed" | "per_unit" | "prorata" } | null; };
type PricingRule = { id: number; service_id: number; unit: "m2" | "meter" | "piece"; calculation_method: "fixed" | "per_unit" | "prorata"; reference_quantity: string | number | null; min_price: string | number; max_price: string | number; is_active: boolean; service?: { id: number; title: string }; };
type PricingRuleForm = { service_id: string; unit: "m2" | "meter" | "piece"; calculation_method: "fixed" | "per_unit" | "prorata"; reference_quantity: string; min_price: string; max_price: string; is_active: boolean; };
const emptyPricingRuleForm = (): PricingRuleForm => ({ service_id: "", unit: "m2", calculation_method: "prorata", reference_quantity: "100", min_price: "", max_price: "", is_active: true });
const findService = (services: PublicApiService[], id: number): PublicApiService | undefined => { for (const service of services) { if (service.id === id) return service; const child = findService(service.children ?? [], id); if (child) return child; } };
const flattenServices = (services: PublicApiService[], depth = 0): Array<PublicApiService & { depth: number }> => services.flatMap((service) => [{ ...service, depth }, ...flattenServices(service.children ?? [], depth + 1)]);
const unitLabel = (unit: PricingRule["unit"]) => unit === "m2" ? "m²" : unit === "meter" ? "mètre" : "pièce";
const formulaLabel = (formula: PricingRule["calculation_method"]) => formula === "prorata" ? "Au prorata" : formula === "per_unit" ? "Par unité" : "Prix fixe";

export function PricingRulesPage({ token }: { token: string }) {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [services, setServices] = useState<PublicApiService[]>([]);
  const [form, setForm] = useState<PricingRuleForm>(emptyPricingRuleForm);
  const [pricingMode, setPricingMode] = useState<"estimate" | "on_quote">("estimate");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const flatServices = flattenServices(services);
  const selectedService = form.service_id
    ? findService(services, Number(form.service_id))
    : undefined;
  const selectServiceForPricing = (serviceId: string) => {
    const service = findService(services, Number(serviceId));
    const existingRule = rules.find(
      (rule) => rule.service_id === Number(serviceId),
    );

    setPricingMode(service?.pricing_mode ?? "estimate");

    setForm(
      existingRule
        ? {
            service_id: serviceId,
            unit: existingRule.unit,
            calculation_method: existingRule.calculation_method,
            reference_quantity: String(existingRule.reference_quantity ?? "100"),
            min_price: String(existingRule.min_price),
            max_price: String(existingRule.max_price),
            is_active: existingRule.is_active,
          }
        : { ...emptyPricingRuleForm(), service_id: serviceId },
    );
  };
  const load = async () => {
    const [serviceResponse, ruleResponse] = await Promise.all([
      fetch(`${apiUrl}/services`),
      fetch(`${apiUrl}/admin/pricing-rules`, { headers }),
    ]);
    if (!serviceResponse.ok || !ruleResponse.ok) {
      setError("Impossible de charger les règles de prix.");
      return;
    }
    const [serviceData, ruleData] = await Promise.all([
      serviceResponse.json(),
      ruleResponse.json(),
    ]);
    setServices(serviceData.data ?? []);
    setRules(ruleData.data ?? []);
  };
  useEffect(() => {
    void load();
  }, [token]);
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!selectedService || selectedService.children?.length) {
      setError("Choisissez une prestation finale, pas une catégorie.");
      return;
    }
    const existingRule = rules.find(
      (rule) => rule.service_id === selectedService.id,
    );
    if (
      existingRule &&
      !window.confirm(
        `Une règle existe déjà pour « ${selectedService.title} ». Voulez-vous la modifier ?`,
      )
    ) {
      return;
    }
    const modeResponse = await fetch(
      `${apiUrl}/admin/services/${selectedService.id}`,
      {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ pricing_mode: pricingMode }),
      },
    );
    if (!modeResponse.ok) {
      setError("Impossible d’enregistrer le mode de tarification.");
      return;
    }
    const modeData = await modeResponse.json().catch(() => null);
    if (modeData?.data) {
      const updateService = (items: PublicApiService[]): PublicApiService[] =>
        items.map((item) =>
          item.id === selectedService.id
            ? { ...item, ...modeData.data }
            : {
                ...item,
                children: item.children
                  ? updateService(item.children)
                  : item.children,
              },
        );
      setServices((current) => updateService(current));
    }
    if (pricingMode === "on_quote") {
      setMessage("Cette prestation est maintenant proposée uniquement sur devis.");
      void load();
      return;
    }
    const payload = {
      ...form,
      service_id: Number(form.service_id),
      reference_quantity:
        form.calculation_method === "prorata"
          ? Number(form.reference_quantity)
          : null,
      min_price: Number(form.min_price),
      max_price: Number(form.max_price),
    };
    const response = await fetch(`${apiUrl}/admin/pricing-rules`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.message ?? "Enregistrement impossible.");
      return;
    }
    if (data?.data) {
      const savedRule = data.data as PricingRule;
      setRules((current) => {
        const hasExistingRule = current.some((rule) => rule.id === savedRule.id);
        return hasExistingRule
          ? current.map((rule) => (rule.id === savedRule.id ? savedRule : rule))
          : [savedRule, ...current];
      });
    }
    setMessage("Règle de prix enregistrée.");
    setForm(emptyPricingRuleForm());
    setPricingMode("estimate");
    void load();
  };
  const deleteRule = async (rule: PricingRule) => {
    if (!window.confirm(`Supprimer la règle de prix « ${rule.service?.title ?? "cette prestation"} » ?`)) return;

    setError("");
    setRules((current) => current.filter((item) => item.id !== rule.id));
    const response = await fetch(`${apiUrl}/admin/pricing-rules/${rule.id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.message ?? "Suppression impossible.");
      await load();
      return;
    }

    setMessage("Règle de prix supprimée.");
  };
  return (
    <section className="bwd-admin-grid bwd-pricing-layout">
      <form className="bwd-admin-form bwd-pricing-form" onSubmit={save}>
        <div className="bwd-pricing-form-heading"><p className="bwd-eyebrow">Nouvelle estimation</p><h2>Configurer une règle</h2><span>Définissez le calcul qui sera affiché au client.</span></div>
        <label>
          Service
          <select
            value={form.service_id}
            onChange={(event) => selectServiceForPricing(event.target.value)}
            required
          >
            <option value="">Choisir</option>
            {flatServices.map((service) => (
              <option
                value={service.id}
                key={service.id}
                disabled={Boolean(service.children?.length)}
              >
                {"— ".repeat(service.depth)}{service.title}
              </option>
            ))}
          </select>
        </label>
        {selectedService && !selectedService.children?.length && (
          <label>
            Mode de tarification
            <select
              value={pricingMode}
              onChange={(event) =>
                setPricingMode(
                  event.target.value as "estimate" | "on_quote",
                )
              }
            >
              <option value="estimate">Estimation automatique</option>
              <option value="on_quote">Sur devis uniquement</option>
            </select>
            <small>« Sur devis » n’affiche aucun prix automatique au client.</small>
          </label>
        )}
        {pricingMode !== "on_quote" && <>
        <div>
          <label>
            Unité
            <select
              value={form.unit}
              onChange={(event) =>
                setForm({
                  ...form,
                  unit: event.target.value as PricingRuleForm["unit"],
                })
              }
            >
              <option value="m2">m²</option>
              <option value="meter">Mètre</option>
              <option value="piece">Pièce</option>
            </select>
          </label>
          <label>
            Formule
            <select
              value={form.calculation_method}
              onChange={(event) =>
                setForm({
                  ...form,
                  calculation_method: event.target
                    .value as PricingRuleForm["calculation_method"],
                })
              }
            >
              <option value="prorata">Au prorata</option>
              <option value="per_unit">Par unité</option>
              <option value="fixed">Prix fixe</option>
            </select>
          </label>
        </div>
        {form.calculation_method === "prorata" && (
          <label>
            Quantité de référence
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.reference_quantity}
              onChange={(event) =>
                setForm({ ...form, reference_quantity: event.target.value })
              }
              required
            />
          </label>
        )}
        <div>
          <label>
            Prix min. (DT)
            <input
              type="number"
              min="0"
              value={form.min_price}
              onChange={(event) =>
                setForm({ ...form, min_price: event.target.value })
              }
              required
            />
          </label>
          <label>
            Prix max. (DT)
            <input
              type="number"
              min="0"
              value={form.max_price}
              onChange={(event) =>
                setForm({ ...form, max_price: event.target.value })
              }
              required
            />
          </label>
        </div>
        </>}
        {error && <p className="bwd-admin-error">{error}</p>}
        {message && <p className="bwd-form-success">{message}</p>}
        <button className="bwd-dark-button">Enregistrer</button>
      </form>
      <section className="bwd-admin-panel bwd-pricing-rules">
        <header><div><p className="bwd-eyebrow">Catalogue</p><h2>Règles actives</h2></div><span>{rules.length} règle{rules.length > 1 ? "s" : ""}</span></header>
        <div className="bwd-admin-list bwd-pricing-rule-list">
          {rules.map((rule) => (
            <article key={rule.id}>
              {(() => {
                const isOnQuote =
                  findService(services, rule.service_id)?.pricing_mode ===
                  "on_quote";
                return <>
                  <div>
                    <strong>{rule.service?.title}</strong>
                    <span>
                      {isOnQuote
                        ? "Sur devis uniquement"
                        : `${rule.min_price} — ${rule.max_price} DT`}
                    </span>
                    <small>
                      {isOnQuote
                        ? "Le client prend rendez-vous pour recevoir le prix final."
                        : `${formulaLabel(rule.calculation_method)} · ${unitLabel(rule.unit)}`}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="bwd-delete-pricing-rule"
                    onClick={() => void deleteRule(rule)}
                  >
                    Supprimer
                  </button>
                </>;
              })()}
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}


