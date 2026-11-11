import { useState } from "react";

export function AppointmentGuide({
  status,
  firstName,
  phone,
  scheduledDate,
  onConfirm,
  onComplete,
  onCancel,
  onCreateQuote,
  busy,
}: {
  status: string;
  firstName: string;
  phone: string;
  scheduledDate: string;
  onConfirm: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onCreateQuote?: () => void;
  busy: boolean;
}) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const activeStep =
    status === "requested"
      ? 1
      : status === "confirmed"
        ? 2
        : status === "completed"
          ? 3
          : 0;
  const steps = [
    [
      "1",
      "Confirmer le créneau",
      "Contactez le prospect et confirmez la date.",
      1,
    ],
    [
      "2",
      "Réaliser le rendez-vous",
      "Validez les mesures, matériaux et contraintes.",
      2,
    ],
    [
      "3",
      "Créer le devis final",
      "Préparez le prix précis après l’échange.",
      3,
    ],
  ] as const;
  const completedCount =
    status === "requested"
      ? 0
      : status === "confirmed"
        ? 1
        : status === "completed"
          ? 2
          : 0;
  const summary =
    status === "requested"
      ? "Il reste à confirmer le créneau avec le client."
      : status === "confirmed"
        ? "Le rendez-vous est confirmé. Il reste à le réaliser."
        : status === "completed"
          ? "2 étapes sur 3 sont faites. Il reste à créer le devis final."
          : "Ce rendez-vous a été annulé.";
  const action = (step: number) =>
    step === 1 ? (
      <>
        <button type="button" className="bwd-guide-contact" onClick={() => setCallDialogOpen(true)}>
          📞 Appeler
        </button>
        <button className="bwd-dark-button" onClick={onConfirm} disabled={busy}>
          ✓ C’est confirmé
        </button>
        <button
          className="bwd-guide-cancel"
          onClick={() => setConfirmCancel(true)}
          disabled={busy}
        >
          Annuler
        </button>
      </>
    ) : step === 2 ? (
      <>
        <button
          className="bwd-dark-button"
          onClick={onComplete}
          disabled={busy}
        >
          Valider le rendez-vous terminé
        </button>
        <button
          className="bwd-guide-cancel"
          onClick={() => setConfirmCancel(true)}
          disabled={busy}
        >
          Annuler
        </button>
      </>
    ) : (
      <button
        className="bwd-dark-button"
        onClick={onCreateQuote}
        disabled={busy || !onCreateQuote}
      >
        Créer le devis final
      </button>
    );
  return (
    <section className="bwd-appointment-guide">
      <div className="bwd-guide-heading">
        <p className="bwd-eyebrow">Guide du rendez-vous</p>
        <h3>Où en êtes-vous ?</h3>
        <p>
          {completedCount} étape{completedCount > 1 ? "s" : ""} sur 3 est
          {completedCount > 1 ? "s" : ""} faite{completedCount > 1 ? "s" : ""}.{" "}
          {summary}
        </p>
      </div>
      <ol>
        {steps.map(([number, title, _description, step]) => (
          <li
            key={number}
            className={
              step < activeStep
                ? "complete"
                : step === activeStep
                  ? "current"
                  : ""
            }
          >
            <span className="bwd-guide-circle">
              {step < activeStep ? "✓" : number}
            </span>
            <div className="bwd-guide-step-copy">
              <strong>{title}</strong>
            </div>
          </li>
        ))}
      </ol>
      {status !== "cancelled" && activeStep > 0 && (
        <div className="bwd-guide-action-card">
          <strong>{activeStep === 1 ? `Confirmez le créneau avec ${firstName}` : steps[activeStep - 1][1]}</strong>
          <small>{activeStep === 1 ? `Appelez ou écrivez au client pour valider le ${scheduledDate}.` : steps[activeStep - 1][2]}</small>
          <div>{action(activeStep)}</div>
        </div>
      )}
      {confirmCancel && (
        <div
          className="bwd-cancel-confirmation"
          role="alertdialog"
          aria-modal="true"
          aria-label="Confirmer l’annulation"
        >
          <div>
            <p className="bwd-eyebrow">Confirmation requise</p>
            <h3>Annuler ce rendez-vous ?</h3>
            <p>
              Le prospect sera marqué comme annulé. Cette action ne peut être
              annulée depuis ce guide.
            </p>
            <div>
              <button
                className="bwd-guide-cancel"
                onClick={() => setConfirmCancel(false)}
                disabled={busy}
              >
                Retour
              </button>
              <button
                className="bwd-confirm-cancel"
                onClick={() => {
                  setConfirmCancel(false);
                  onCancel();
                }}
                disabled={busy}
              >
                Oui, annuler le rendez-vous
              </button>
            </div>
          </div>
        </div>
      )}
      {callDialogOpen && (
        <div className="bwd-call-confirmation" role="dialog" aria-modal="true" aria-label="Appeler le client">
          <div>
            <p className="bwd-eyebrow">Appeler le client</p>
            <h3>{firstName}</h3>
            <strong>{phone}</strong>
            <p>Après l’appel, indiquez simplement le résultat.</p>
            <div>
              <button className="bwd-guide-cancel" onClick={() => setCallDialogOpen(false)} disabled={busy}>Non joignable</button>
              <button className="bwd-dark-button" onClick={() => { setCallDialogOpen(false); onConfirm(); }} disabled={busy}>✓ Le client a confirmé</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


