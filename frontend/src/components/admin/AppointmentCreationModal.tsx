import type { FormEvent } from "react";

type AdminQuoteRequest = {
  first_name: string;
  last_name: string;
  service?: { title: string };
};

type AppointmentForm = {
  mode: string;
  platform: string;
  scheduled_at: string;
  city: string;
  address: string;
  notes: string;
};

type AppointmentCreationModalProps = {
  request: AdminQuoteRequest;
  form: AppointmentForm;
  setForm: (form: AppointmentForm) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  busy: boolean;
};

export function AppointmentCreationModal({
  request,
  form,
  setForm,
  onClose,
  onSubmit,
  busy,
}: AppointmentCreationModalProps) {
  return (
    <div className="bwd-appointment-modal" role="presentation" onMouseDown={onClose}>
      <div className="bwd-appointment-modal-dialog bwd-quote-modal-dialog" role="dialog" aria-modal="true" aria-label="Confirmer le rendez-vous" onMouseDown={(event) => event.stopPropagation()}>
        <button className="bwd-modal-close" onClick={onClose} aria-label="Fermer">×</button>
        <form className="bwd-admin-form bwd-admin-quote-form" onSubmit={onSubmit}>
          <div className="bwd-admin-form-title">
            <div>
              <p className="bwd-eyebrow">Étape 1 sur 4 · Rendez-vous</p>
              <h2>Confirmer le rendez-vous</h2>
              <small>{request.first_name} {request.last_name} · {request.service?.title ?? "Prestation à préciser"}</small>
            </div>
          </div>
          <p>Choisissez le créneau convenu avec le prospect, puis confirmez-le.</p>
          <div>
            <label>
              Type
              <select value={form.mode} onChange={(event) => setForm({ ...form, mode: event.target.value })}>
                <option value="on_site">Visite sur place — payante</option>
                <option value="remote">À distance — gratuit</option>
              </select>
            </label>
            {form.mode === "remote" ? (
              <label>
                Plateforme
                <select value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value })}>
                  <option value="whatsapp">WhatsApp — gratuit</option>
                  <option value="zoom">Zoom — gratuit</option>
                </select>
              </label>
            ) : (
              <label>
                Ville
                <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} required />
              </label>
            )}
          </div>
          {form.mode === "on_site" && (
            <label>
              Adresse de la visite
              <input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} required />
            </label>
          )}
          <label>
            Date et heure
            <input type="datetime-local" value={form.scheduled_at} onChange={(event) => setForm({ ...form, scheduled_at: event.target.value })} required />
          </label>
          <label>
            Note interne (facultative)
            <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Mesures à prendre, matériaux à confirmer…" />
          </label>
          <div className="bwd-quote-modal-actions">
            <button type="button" className="bwd-guide-cancel" onClick={onClose}>Ne pas confirmer maintenant</button>
            <button className="bwd-dark-button" disabled={busy}>Confirmer le rendez-vous →</button>
          </div>
        </form>
      </div>
    </div>
  );
}
