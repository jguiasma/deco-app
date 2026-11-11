import type { FormEvent } from "react";

type AdminQuoteRequest = {
  first_name: string;
  last_name: string;
  service?: { title: string };
  quantity: string | number;
  unit: string | null;
  estimated_min: string | number | null;
  estimated_max: string | number | null;
  dimensions?: string | null;
  service_type: string | null;
  approximate_budget?: string | number | null;
  description: string;
};

type QuoteForm = {
  label: string;
  quantity: string;
  unit: string;
  unit_price: string;
  dimensions: string;
  discount_enabled: boolean;
  discount_type: "percent" | "amount";
  discount_value: string;
  discount_reason: string;
  valid_until: string;
  notes: string;
};

export function QuoteModal({
  request,
  form,
  setForm,
  onClose,
  onSubmit,
  busy,
}: {
  request: AdminQuoteRequest;
  form: QuoteForm;
  setForm: (form: QuoteForm) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  busy: boolean;
}) {
  const estimate =
    request.estimated_min !== null && request.estimated_max !== null
      ? `${request.estimated_min} — ${request.estimated_max} DT`
      : "Sur devis";
  const subtotal = Number(form.quantity || 0) * Number(form.unit_price || 0);
  const rawDiscount = Number(form.discount_value || 0);
  const discount = form.discount_enabled
    ? form.discount_type === "percent"
      ? subtotal * Math.min(Math.max(rawDiscount, 0), 100) / 100
      : Math.min(Math.max(rawDiscount, 0), subtotal)
    : 0;
  const total = Math.max(subtotal - discount, 0);
  const money = (value: number) => new Intl.NumberFormat("fr-TN", { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value);

  return (
    <div
      className="bwd-appointment-modal"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="bwd-appointment-modal-dialog bwd-quote-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Créer le devis final"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="bwd-modal-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <form className="bwd-quote-builder" onSubmit={onSubmit}>
          <header className="bwd-quote-builder-head"><h2>Créer le devis</h2><p>Pour <strong>{request.first_name} {request.last_name}</strong> · {request.service?.title ?? "Prestation"}</p></header>
          <div className="bwd-quote-builder-layout">
            <main>
              <section className="bwd-quote-builder-card bwd-quote-client-request"><h3>Ce que le client a demandé</h3><div className="bwd-quote-estimate-chip"><span>Estimation initiale</span><strong>{estimate}</strong></div><div className="bwd-quote-description"><span>Description</span><p>{request.description || "Non renseignée"}</p></div><small>Service : {request.service?.title ?? "Non précisé"} · Quantité : {request.quantity} {request.unit ?? ""} · Dimensions : {request.dimensions || "Non renseignées"}</small></section>
              <section className="bwd-quote-builder-card"><h3><i>1</i> Ce que vous facturez</h3><div className="bwd-quote-line"><label>Prestation<input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} required /></label><div className="bwd-quote-line-fields"><label>Quantité<input type="number" min="0.01" step="0.01" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} required /></label><label>Unité<input value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} /></label><label>Prix unitaire (DT)<input type="number" min="0" step="0.001" value={form.unit_price} onChange={(event) => setForm({ ...form, unit_price: event.target.value })} required /></label></div><p>Total ligne : <strong>{money(subtotal)} DT</strong></p></div></section>
              <section className="bwd-quote-builder-card bwd-discount-card"><h3><i>2</i> Remise <small>(facultatif)</small></h3><label className="bwd-discount-toggle"><input type="checkbox" checked={form.discount_enabled} onChange={(event) => setForm({ ...form, discount_enabled: event.target.checked })} /><span>Accorder une remise au client</span></label>{form.discount_enabled && <div className="bwd-discount-fields"><label>Type<span className="bwd-discount-type"><button type="button" className={form.discount_type === "percent" ? "is-active" : ""} onClick={() => setForm({ ...form, discount_type: "percent" })}>en %</button><button type="button" className={form.discount_type === "amount" ? "is-active" : ""} onClick={() => setForm({ ...form, discount_type: "amount" })}>en DT</button></span></label><label>Montant de la remise<input type="number" min="0" max={form.discount_type === "percent" ? 100 : subtotal} step="0.001" value={form.discount_value} onChange={(event) => setForm({ ...form, discount_value: event.target.value })} placeholder="Ex. 10" /></label><label>Motif <small>(facultatif)</small><input value={form.discount_reason} onChange={(event) => setForm({ ...form, discount_reason: event.target.value })} placeholder="Ex. Fidélité, grosse commande" /></label></div>}</section>
              <section className="bwd-quote-builder-card"><h3><i>3</i> Conditions</h3><label>Dimensions / mesures <small>(facultatif)</small><input value={form.dimensions} onChange={(event) => setForm({ ...form, dimensions: event.target.value })} placeholder="Ex. 2,40 m × 1,80 m" /></label><label>Le devis est valable jusqu’au<input type="date" value={form.valid_until} onChange={(event) => setForm({ ...form, valid_until: event.target.value })} /></label><label>Notes pour le client <small>(facultatif)</small><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Conditions de paiement, ce qui est inclus, délais…" /></label></section>
            </main>
            <aside className="bwd-quote-summary"><h3>Récapitulatif</h3><p><span>Lignes</span><b>1</b></p><p><span>Valable jusqu’au</span><b>{form.valid_until || "—"}</b></p><p><span>Sous-total</span><b>{money(subtotal)} DT</b></p>{form.discount_enabled && <p className="bwd-summary-discount"><span>Remise{form.discount_reason ? ` · ${form.discount_reason}` : ""}</span><b>− {money(discount)} DT</b></p>}<div><strong>Total</strong><em>{money(total)} DT</em></div><button className="bwd-dark-button" disabled={busy}>Créer le devis final →</button><button type="button" className="bwd-quote-cancel" onClick={onClose}>Annuler</button></aside>
          </div>
        </form>
      </div>
    </div>
  );
}


