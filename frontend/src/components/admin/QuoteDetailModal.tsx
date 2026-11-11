type AdminQuote = {
  quote_number: string;
  status: string;
  subtotal?: string | number;
  discount?: string | number;
  total: string | number;
  currency: string;
  quote_request?: {
    first_name: string;
    last_name: string;
    phone?: string | null;
    email?: string | null;
    city?: string | null;
    address?: string | null;
    description?: string | null;
    service?: { title: string } | null;
    appointments?: Array<{
      id: number;
      appointment_mode: string;
      remote_platform: string | null;
      scheduled_at: string | null;
      status: string;
      notes: string | null;
    }>;
  } | null;
  items?: Array<{
    id: number;
    label: string;
    description: string | null;
    quantity: string | number;
    unit: string | null;
    unit_price: string | number;
    line_total: string | number;
  }>;
};

export function QuoteDetailModal({
  quote,
  money,
  date,
  busy,
  onClose,
  onStatusChange,
  onDownload,
  onCreateProject,
}: {
  quote: AdminQuote;
  money: (value: string | number | null | undefined) => string;
  date: (value: string | null) => string;
  busy: boolean;
  onClose: () => void;
  onStatusChange: (status: "sent" | "accepted" | "rejected") => void;
  onDownload: () => void;
  onCreateProject: () => void;
}) {
  const client = quote.quote_request;
  const appointment = client?.appointments?.[0];
  const statusLabel =
    quote.status === "draft"
      ? "À envoyer"
      : quote.status === "sent"
        ? "En attente de réponse"
        : quote.status === "accepted"
          ? "Accepté"
          : "Refusé";
  const step = quote.status === "draft" ? 0 : quote.status === "sent" ? 1 : 2;
  const steps = ["Devis créé", "Envoyé au client", "Réponse du client"];
  const appointmentMode = appointment?.appointment_mode === "on_site"
    ? "Visite sur place"
    : appointment?.remote_platform === "zoom"
      ? "Zoom"
      : "WhatsApp";

  return (
    <div className="bwd-appointment-modal" role="presentation" onMouseDown={onClose}>
      <section
        className="bwd-appointment-modal-dialog bwd-quote-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Devis ${quote.quote_number}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="bwd-modal-close" onClick={onClose} aria-label="Fermer">
          ×
        </button>
        <div className="bwd-quote-detail bwd-final-quote-view">
          <header className="bwd-final-quote-head">
            <p>DEVIS FINAL · <strong>{quote.quote_number}</strong></p>
            <h2>{client ? `${client.first_name} ${client.last_name}` : "Client"}</h2>
            <span className={`bwd-status bwd-status-${quote.status}`}>{statusLabel}</span>
          </header>

          <ol className="bwd-quote-status-steps" aria-label="Avancement du devis">
            {steps.map((label, index) => <li key={label} className={index < step ? "complete" : index === step ? "current" : ""}><i>{index < step ? "✓" : index + 1}</i><span>{label}</span></li>)}
          </ol>

          <section className="bwd-quote-next-action">
            {quote.status === "draft" && (
              <>
                <div><strong>Prochaine étape : envoyer le devis</strong><p>Vérifiez le PDF, puis envoyez le devis au client.</p></div>
                <div className="bwd-quote-draft-actions">
                  <button className="bwd-quote-pdf-preview" disabled={busy} onClick={onDownload}>
                    {busy ? "Génération du PDF…" : "Voir le PDF"}
                  </button>
                  <button className="bwd-dark-button" disabled={busy} onClick={() => onStatusChange("sent")}>Envoyer le devis →</button>
                </div>
              </>
            )}
            {quote.status === "sent" && (
              <>
                <div><strong>Prochaine étape : réponse du client</strong><p>Après son retour, choisissez une seule réponse.</p></div>
                <div className="bwd-quote-decision-actions">
                  <button disabled={busy} className="bwd-quote-accept" onClick={() => onStatusChange("accepted")}>✓ Accepté</button>
                  <button disabled={busy} className="bwd-quote-reject" onClick={() => onStatusChange("rejected")}>Refusé</button>
                </div>
              </>
            )}
            {quote.status === "accepted" && (
              <>
                <div><strong>Devis accepté</strong><p>Créez maintenant le projet pour suivre les travaux.</p></div>
                <button className="bwd-dark-button" disabled={busy} onClick={onCreateProject}>Créer le projet →</button>
              </>
            )}
            {quote.status === "rejected" && (
              <div><strong>Devis refusé</strong><p>Aucune autre action n’est nécessaire pour ce dossier.</p></div>
            )}
          </section>

          <div className="bwd-quote-detail-grid">
            <article>
              <h3>Client</h3>
              <dl><dt>Téléphone</dt><dd>{client?.phone ?? "Non renseigné"}</dd><dt>E-mail</dt><dd>{client?.email ?? "Non renseigné"}</dd><dt>Ville</dt><dd>{client?.city ?? "Non renseignée"}</dd></dl>
            </article>
            <article>
              <h3>Rendez-vous</h3>
              {appointment ? (
                <dl><dt>Type</dt><dd>{appointmentMode}</dd><dt>Date</dt><dd>{date(appointment.scheduled_at)} <em className={`bwd-appointment-state bwd-appointment-state-${appointment.status}`}>{appointment.status === "completed" ? "Terminé" : appointment.status}</em></dd><dt>Notes</dt><dd>{appointment.notes || "—"}</dd></dl>
              ) : <p>Aucun rendez-vous renseigné.</p>}
            </article>
          </div>

          <article className="bwd-quote-project-summary">
            <h3>Projet</h3>
            <strong>{client?.service?.title ?? "Prestation à préciser"}</strong>
            {client?.description && <p>{client.description}</p>}
          </article>

          <article className="bwd-quote-lines">
            <h3>Détail du devis</h3>
            <div className="bwd-quote-table-wrap"><table><thead><tr><th>Prestation</th><th>Quantité</th><th>Prix unitaire</th><th>Total</th></tr></thead><tbody>{(quote.items ?? []).map((item) => <tr key={item.id}><td>{item.label}</td><td>{item.quantity} {item.unit ?? ""}</td><td>{money(item.unit_price)} DT</td><td>{money(item.line_total)} DT</td></tr>)}</tbody></table></div>
            {Number(quote.discount ?? 0) > 0 && <p className="bwd-final-discount">Remise appliquée <strong>− {money(quote.discount)} DT</strong></p>}
            <footer><strong>Total à payer</strong><b>{money(quote.total)} {quote.currency}</b></footer>
          </article>

          <button className="bwd-quote-pdf-link" disabled={busy} onClick={onDownload}>Télécharger le PDF</button>
        </div>
      </section>
    </div>
  );
}


