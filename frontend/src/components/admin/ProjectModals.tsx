import type { FormEvent } from "react";
import { CheckCircle2, Folder, FolderPlus, Hammer } from "lucide-react";

type AdminProject = {
  id: number;
  quote_id: number;
  title: string;
  status: string;
  start_date: string | null;
  expected_completion_date: string | null;
  quote?: { quote_number: string };
};

type AdminQuote = {
  id: number;
  quote_number: string;
  quote_request?: {
    first_name: string;
    last_name: string;
  } | null;
};

export function ProjectManagementModal({
  project,
  busy,
  onClose,
  onAdvance,
}: {
  project: AdminProject;
  busy: boolean;
  onClose: () => void;
  onAdvance: (status: AdminProject["status"]) => void;
}) {
  const steps = [
    ["planning", "Préparation"],
    ["in_progress", "Travaux en cours"],
    ["installation", "Installation"],
    ["completed", "Terminé"],
  ] as const;
  const current = Math.max(0, steps.findIndex(([status]) => status === project.status));
  const next = steps[current + 1];
  const currentLabel = steps[current][1];

  return (
    <div className="bwd-appointment-modal" role="presentation" onMouseDown={onClose}>
      <section className="bwd-appointment-modal-dialog bwd-project-modal" role="dialog" aria-modal="true" aria-label="Gérer le projet" onMouseDown={(event) => event.stopPropagation()}>
        <button className="bwd-modal-close" onClick={onClose} aria-label="Fermer">×</button>
        <div className="bwd-project-modal-content bwd-project-modal-violet">
          <header className="bwd-project-modal-header">
            <span className="bwd-project-folder-mark"><Folder aria-hidden="true" /></span>
            <div>
              <p className="bwd-eyebrow">Projet client</p>
              <h2>{project.title}</h2>
              <div className="bwd-project-modal-meta">
                <span>{project.quote?.quote_number ?? "Devis associé"}</span>
                <b>{currentLabel}</b>
                <em>Étape {current + 1} sur 4</em>
              </div>
            </div>
          </header>
          <ol className="bwd-project-progress">
            {steps.map(([status, label], index) => (
              <li key={status} className={index < current ? "complete" : index === current ? "current" : ""}>
                <span>{index < current ? "✓" : index + 1}</span>
                <b>{label}</b>
              </li>
            ))}
          </ol>
          {next ? (
            <div className="bwd-project-next-action">
              <Hammer aria-hidden="true" />
              <div><strong>Prochaine action</strong><p>Passer le projet à : <b>{next[1]}</b></p></div>
              <button className="bwd-project-advance" disabled={busy} onClick={() => onAdvance(next[0])}>Passer à {next[1]} →</button>
            </div>
          ) : (
            <div className="bwd-project-finished"><CheckCircle2 aria-hidden="true" /><div><strong>Projet terminé</strong><p>Aucune autre action n’est nécessaire.</p></div></div>
          )}
        </div>
      </section>
    </div>
  );
}

export function ProjectCreationModal({
  quote,
  title,
  setTitle,
  busy,
  onClose,
  onSubmit,
}: {
  quote: AdminQuote;
  title: string;
  setTitle: (title: string) => void;
  busy: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="bwd-appointment-modal" role="presentation" onMouseDown={onClose}>
      <section className="bwd-appointment-modal-dialog bwd-project-modal" role="dialog" aria-modal="true" aria-label="Créer le projet" onMouseDown={(event) => event.stopPropagation()}>
        <button className="bwd-modal-close" onClick={onClose} aria-label="Fermer">×</button>
        <form className="bwd-admin-form bwd-admin-quote-form bwd-project-creation" onSubmit={onSubmit}>
          <div className="bwd-admin-form-title">
            <div>
              <p className="bwd-eyebrow">Étape 4 sur 4 · Projet</p>
              <h2>Nommer le projet</h2>
              <small>Devis {quote.quote_number} · {quote.quote_request?.first_name ?? ""} {quote.quote_request?.last_name ?? ""}</small>
            </div>
          </div>
          <ol className="bwd-project-progress" aria-label="Étapes du dossier">
            <li className="complete"><span>✓</span><b>Rendez-vous</b></li>
            <li className="complete"><span>✓</span><b>Devis</b></li>
            <li className="complete"><span>✓</span><b>Réponse</b></li>
            <li className="current"><span>4</span><b>Projet</b></li>
          </ol>
          <label>
            ✎ Nom du projet
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex. Salon de Mme Ben Salem" required autoFocus />
          </label>
          <p className="bwd-admin-email-note">Après la création, vous resterez dans ce dossier pour suivre la préparation, les travaux et l’installation.</p>
          <div className="bwd-quote-modal-actions">
            <button type="button" className="bwd-guide-cancel" onClick={onClose}>Retour au dossier</button>
            <button className="bwd-dark-button bwd-create-project-button" disabled={busy}><FolderPlus aria-hidden="true" /> {busy ? "Création…" : "Créer le projet →"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}


