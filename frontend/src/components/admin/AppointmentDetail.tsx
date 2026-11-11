import { AppointmentGuide } from "./AppointmentGuide";

type AdminAppointment = {
  id: number; first_name: string; last_name: string; phone: string; email: string | null; city: string | null; address: string | null; appointment_mode: string; remote_platform: string | null; scheduled_at: string | null; status: string; notes: string | null; admin_notes?: string | null;
  quote_request?: { id: number; service?: { title: string } | null; quantity: string | number; unit: string | null; estimated_min: string | number | null; estimated_max: string | number | null; dimensions: string | null; description: string } | null;
};

export function AppointmentDetail({
  appointment,
  date,
  onBack,
  onUpdate,
  onCreateQuote,
  busy,
}: {
  appointment: AdminAppointment;
  date: (value: string | null) => string;
  onBack: () => void;
  onUpdate: (status: string) => void;
  onCreateQuote?: () => void;
  busy: boolean;
}) {
  const mode =
    appointment.appointment_mode === "on_site"
      ? "Visite sur place — payante"
      : `${appointment.remote_platform === "zoom" ? "Zoom" : "WhatsApp"} — gratuit`;
  return (
    <section className="bwd-admin-panel bwd-request-detail bwd-appointment-detail">
      <button className="bwd-back-button" onClick={onBack}>
        ← Tous les rendez-vous
      </button>
      <div className="bwd-request-detail-head">
        <div>
          <p className="bwd-eyebrow">Rendez-vous #{appointment.id}</p>
          <h2>
            {appointment.first_name} {appointment.last_name}
          </h2>
          <p>
            {mode} · {date(appointment.scheduled_at)}
          </p>
        </div>
        <span className={"bwd-status bwd-status-" + appointment.status}>
          {appointment.status === "requested"
            ? "À confirmer"
            : appointment.status === "confirmed"
              ? "Confirmé"
              : appointment.status === "completed"
                ? "Terminé"
                : "Annulé"}
        </span>
      </div>
      <AppointmentGuide
        status={appointment.status}
        busy={busy}
        firstName={appointment.first_name}
        phone={appointment.phone}
        scheduledDate={date(appointment.scheduled_at)}
        onConfirm={() => onUpdate("confirmed")}
        onComplete={() => onUpdate("completed")}
        onCancel={() => onUpdate("cancelled")}
        onCreateQuote={onCreateQuote}
      />
      <div className="bwd-request-detail-grid">
        <article>
          <h3>Le client</h3>
          <p>
            <strong>Téléphone</strong>
            {appointment.phone}
          </p>
          <p>
            <strong>E-mail</strong>
            {appointment.email ?? "Non renseigné"}
          </p>
          <p>
            <strong>Ville</strong>
            {appointment.city ?? "Non renseignée"}
          </p>
          <p>
            <strong>Adresse</strong>
            {appointment.address ?? "Non renseignée"}
          </p>
        </article>
        <article>
          <h3>Rendez-vous</h3>
          <p>
            <strong>Type</strong>
            {mode}
          </p>
          <p>
            <strong>Date et heure</strong>
            {date(appointment.scheduled_at)}
          </p>
          <p>
            <strong>Statut</strong>
            {appointment.status}
          </p>
          <p>
            <strong>Référence projet</strong>
            {appointment.quote_request
              ? "Demande #" + appointment.quote_request.id
              : "Première consultation"}
          </p>
        </article>
      </div>
      {appointment.quote_request && (
        <>
          <aside className="bwd-admin-estimate">
            <p>Estimation donnée au client</p>
            <strong>
              {appointment.quote_request.estimated_min !== null && appointment.quote_request.estimated_max !== null
                ? `${appointment.quote_request.estimated_min} — ${appointment.quote_request.estimated_max} DT`
                : "Sur devis"}
            </strong>
            <small>
              {appointment.quote_request.estimated_min !== null && appointment.quote_request.estimated_max !== null
                ? "Montant indicatif affiché avant la prise de rendez-vous."
                : "Aucun montant n’a été calculé : le prix sera défini après le rendez-vous."}
            </small>
          </aside>
          <article className="bwd-request-description">
            <h3>Ce que le client demande</h3>
            <p>
              <strong>
                {appointment.quote_request.service?.title ??
                  "Service à préciser"}
              </strong>
              <br />
              Quantité : {appointment.quote_request.quantity}{" "}
              {appointment.quote_request.unit ?? ""}
              <br />
              Dimensions :{" "}
              {appointment.quote_request.dimensions ?? "Non renseignées"}
              <br />
              <br />
              {appointment.quote_request.description}
            </p>
          </article>
        </>
      )}
      {appointment.notes && (
        <article className="bwd-request-description">
          <h3>Notes du prospect</h3>
          <p>{appointment.notes}</p>
        </article>
      )}
      {appointment.admin_notes && (
        <article className="bwd-request-description">
          <h3>Notes internes</h3>
          <p>{appointment.admin_notes}</p>
        </article>
      )}
    </section>
  );
}


