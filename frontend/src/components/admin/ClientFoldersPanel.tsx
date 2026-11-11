import { Fragment, useState } from "react";
import {
  CalendarCheck,
  ChevronDown,
  CheckCircle2,
  Clock3,
  FileText,
  FolderPlus,
  Hammer,
  XCircle,
} from "lucide-react";

type AdminQuoteRequest = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  address: string | null;
  service_type: string | null;
  quantity: string | number;
  unit: string | null;
  estimated_min: string | number | null;
  estimated_max: string | number | null;
  description: string;
  dimensions?: string | null;
  approximate_budget?: string | number | null;
  status: string;
  created_at: string | null;
  service?: { title: string };
  images?: Array<{
    id: number;
    original_name: string;
    mime_type: string;
    size: number;
    download_url: string;
  }>;
};

type AdminAppointment = {
  id: number;
  quote_request_id: number | null;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  address: string | null;
  appointment_type: string;
  appointment_mode: string;
  remote_platform: string | null;
  scheduled_at: string | null;
  status: string;
  notes: string | null;
  admin_notes?: string | null;
  created_at?: string | null;
  quote_request?: {
    id: number;
    service?: { title: string } | null;
    quantity: string | number;
    unit: string | null;
    estimated_min: string | number | null;
    estimated_max: string | number | null;
    dimensions: string | null;
    description: string;
  } | null;
};

type AdminQuote = {
  id: number;
  quote_number: string;
  quote_request_id: number | null;
  status: string;
  total: string | number;
  currency: string;
  created_at: string | null;
  quote_request?: {
    id: number;
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

type AdminProject = {
  id: number;
  quote_id: number;
  title: string;
  status: string;
  start_date: string | null;
  expected_completion_date: string | null;
  quote?: { quote_number: string };
};

type ClientFolder = {
  request: AdminQuoteRequest;
  appointment?: AdminAppointment;
  quote?: AdminQuote;
  project?: AdminProject;
};

export function ClientFoldersPanel({
  folders,
  date,
  money,
  onOpenAppointment,
  onCreateAppointment,
  onOpenQuote,
  onCreateProject,
  onOpenProject,
  onDeleteFolder,
  appointmentOnly = false,
}: {
  folders: ClientFolder[];
  date: (value: string | null) => string;
  money: (value: string | number | null | undefined) => string;
  onOpenAppointment: (appointment: AdminAppointment) => void;
  onCreateAppointment: (request: AdminQuoteRequest) => void;
  onOpenQuote: (quote: AdminQuote) => void;
  onCreateProject: (quote: AdminQuote) => void;
  onOpenProject: (project: AdminProject) => void;
  onDeleteFolder: (folder: ClientFolder) => void;
  appointmentOnly?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stepFilter, setStepFilter] = useState("all");
  const [expandedCompletedProjects, setExpandedCompletedProjects] = useState<number[]>([]);
  const receivedLabel = (createdAt?: string | null) => {
    if (!createdAt) return "Nouveau rendez-vous";
    const received = new Date(createdAt);
    const now = new Date();
    const isToday = received.toDateString() === now.toDateString();
    const time = new Intl.DateTimeFormat("fr-TN", { hour: "2-digit", minute: "2-digit" }).format(received).replace(":", "h");
    return isToday ? `Reçu aujourd’hui à ${time}` : `Reçu le ${new Intl.DateTimeFormat("fr-TN", { day: "numeric", month: "long" }).format(received)} à ${time}`;
  };

  const folderStep = (folder: ClientFolder) => {
    if (folder.project || folder.quote?.status === "accepted") return "project";
    if (folder.quote?.status === "sent" || folder.quote?.status === "rejected") return "response";
    if (folder.quote || folder.appointment?.status === "completed") return "quote";
    return "appointment";
  };

  const visibleFolders = folders.filter((folder) => {
    const searchable = [
      folder.request.first_name,
      folder.request.last_name,
      folder.request.phone,
      folder.request.service?.title,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("fr");
    const appointment = folder.appointment;
    const matchesSearch = searchable.includes(search.trim().toLocaleLowerCase("fr"));
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "on_site" && appointment?.appointment_mode === "on_site") ||
      (typeFilter === "whatsapp" && appointment?.remote_platform === "whatsapp") ||
      (typeFilter === "zoom" && appointment?.remote_platform === "zoom");
    const appointmentStep = folder.appointment?.status === "confirmed"
      ? "confirmed"
      : folder.appointment?.status === "completed"
        ? "completed"
        : "requested";
    const matchesStep = stepFilter === "all" || (appointmentOnly ? appointmentStep === stepFilter : folderStep(folder) === stepFilter);

    return matchesSearch && matchesType && matchesStep;
  });
  const activeProjectFolders = appointmentOnly
    ? visibleFolders.filter((folder) => Boolean(folder.project))
    : [];
  const preProjectFolders = appointmentOnly
    ? visibleFolders.filter((folder) => !activeProjectFolders.includes(folder))
    : [];
  const displayedFolders = appointmentOnly
    ? [...activeProjectFolders, ...preProjectFolders]
    : visibleFolders;

  const folderState = (folder: ClientFolder) => {
    if (folder.project) {
      if (folder.project.status === "cancelled")
        return { tone: "cancelled", icon: XCircle, title: "Projet annulé", text: "Dossier terminé", action: "Voir les projets" };
      if (folder.project.status === "completed")
        return { tone: "completed", icon: CheckCircle2, title: "Projet terminé", text: "Dossier terminé", action: "Voir les projets" };
      return { tone: "project", icon: Hammer, title: "Projet en cours", text: `Étape : ${folder.project.status === "planning" ? "préparation" : folder.project.status === "installation" ? "installation" : "travaux en cours"}`, action: "Gérer le projet" };
    }
    if (folder.quote) {
      if (folder.quote.status === "rejected")
        return { tone: "rejected", icon: XCircle, title: "Devis refusé", text: "Dossier terminé", action: "Voir le devis" };
      if (folder.quote.status === "accepted")
        return { tone: "accepted", icon: FolderPlus, title: "Devis accepté", text: "Créez maintenant le projet", action: "Créer le projet" };
      if (folder.quote.status === "sent")
        return { tone: "waiting", icon: Clock3, title: "Réponse du client", text: "Choisissez : accepté ou refusé", action: "Voir le devis" };
      return { tone: "quote", icon: FileText, title: "Devis prêt", text: "Envoyez le devis au client", action: "Envoyer le devis" };
    }
    if (folder.appointment) {
      if (folder.appointment.status === "requested")
        return { tone: "appointment", icon: CalendarCheck, title: "Rendez-vous à confirmer", text: date(folder.appointment.scheduled_at), action: "Gérer le rendez-vous" };
      if (folder.appointment.status === "confirmed")
        return { tone: "appointment", icon: CalendarCheck, title: "Rendez-vous à réaliser", text: date(folder.appointment.scheduled_at), action: "Gérer le rendez-vous" };
      if (folder.appointment.status === "completed")
        return { tone: "quote", icon: FileText, title: "Créer le devis final", text: "Le rendez-vous est terminé", action: "Créer le devis" };
      return { tone: "cancelled", icon: XCircle, title: "Rendez-vous annulé", text: "Dossier en attente", action: "Voir le rendez-vous" };
    }
    return { tone: "waiting", icon: Clock3, title: "Étape 1 : confirmer le rendez-vous", text: "Choisissez un créneau avec le prospect.", action: "Gérer le dossier" };
  };

  return (
    <section className="bwd-admin-panel bwd-folders-panel">
      <div className="bwd-folders-heading">
        <div>
          <p className="bwd-eyebrow">Espace principal</p>
          <h2>Les rendez-vous</h2>
          <p>{appointmentOnly ? "Cliquez sur « Ouvrir » pour voir ce qu’il reste à faire." : "Ouvrez une carte et faites seulement l’action indiquée."}</p>
        </div>
        <span>{visibleFolders.length} dossier{visibleFolders.length > 1 ? "s" : ""}</span>
      </div>
      <div className="bwd-appointment-filters" aria-label="Recherche et filtres des rendez-vous">
        <label>
          Rechercher
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nom, téléphone ou service"
          />
        </label>
        <label>
          Type
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="all">Tous les types</option>
            <option value="on_site">Visite sur place</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="zoom">Zoom</option>
          </select>
        </label>
        <label>
          {appointmentOnly ? "À faire" : "Étape du dossier"}
          <select value={stepFilter} onChange={(event) => setStepFilter(event.target.value)}>
            <option value="all">Toutes les étapes</option>
            {appointmentOnly ? <><option value="requested">À confirmer</option><option value="confirmed">À réaliser</option><option value="completed">Devis à préparer</option></> : <option value="appointment">1. Rendez-vous</option>}
            {!appointmentOnly && <><option value="quote">2. Devis à préparer</option><option value="response">3. Réponse au devis</option><option value="project">4. Projet</option></>}
          </select>
        </label>
      </div>
      <div className="bwd-folder-list">
        {displayedFolders.map((folder, index) => {
          const state = folderState(folder);
          const Icon = state.icon;
          const rejected = folder.quote?.status === "rejected";
          const isProject = Boolean(folder.project);
          const isCompletedProject = folder.project?.status === "completed";
          const isCompletedProjectExpanded = isCompletedProject && expandedCompletedProjects.includes(folder.project!.id);
          const isActiveProject = activeProjectFolders.includes(folder);
          const previousIsActiveProject = index > 0 && activeProjectFolders.includes(displayedFolders[index - 1]);
          const showGroupHeading = appointmentOnly && (index === 0 || isActiveProject !== previousIsActiveProject);
          const activeStep = folder.project
            ? 3
            : appointmentOnly
            ? folder.appointment?.status === "completed" ? 2 : folder.appointment?.status === "confirmed" ? 1 : 0
            : folder.quote?.status === "accepted" ? 3
              : folder.quote?.status === "sent" || rejected ? 2
                : folder.quote ? 1
                  : folder.appointment?.status === "completed" ? 1
                    : 0;
          const steps = isProject
            ? ["Rendez-vous", "Devis", "Réponse", "Projet"]
            : appointmentOnly
            ? ["Confirmer", "Réaliser", "Créer le devis"]
            : ["Rendez-vous", "Devis", "Réponse", "Projet"];
          const appointmentStageText = folder.appointment?.status === "confirmed"
            ? "Se rendre au rendez-vous"
            : folder.appointment?.status === "completed"
              ? "Préparer le devis final"
              : "Confirmer la date avec le client";
          const appointmentBadge = folder.appointment?.status === "confirmed"
            ? "Confirmé"
            : folder.appointment?.status === "completed"
              ? "Devis à préparer"
              : "À confirmer";
          const doAction = () => {
            if (folder.project) return onOpenProject(folder.project);
            if (folder.quote?.status === "accepted") return onCreateProject(folder.quote);
            if (folder.quote) return onOpenQuote(folder.quote);
            if (folder.appointment) return onOpenAppointment(folder.appointment);
            onCreateAppointment(folder.request);
          };
          return (<Fragment key={folder.request.id}>
            {showGroupHeading && <div className={`bwd-folder-group-title ${isActiveProject ? "bwd-folder-group-projects" : "bwd-folder-group-appointments"}`}><span>{isActiveProject ? "▱" : "▣"}</span><strong>{isActiveProject ? "Projets en cours" : "Dossiers avant projet"}</strong><b>{isActiveProject ? activeProjectFolders.length : preProjectFolders.length}</b></div>}
            <article
              className={`bwd-folder-card bwd-folder-${state.tone}${appointmentOnly ? ` ${isProject ? `bwd-project-folder-card${isCompletedProject ? ` bwd-project-completed-card${isCompletedProjectExpanded ? " is-expanded" : ""}` : ""}` : `bwd-appointment-folder-card bwd-appointment-stage-${folder.appointment?.status ?? "requested"}`} bwd-appointment-card-interactive` : ""}`}
              key={folder.request.id}
              role={appointmentOnly ? "button" : undefined}
              tabIndex={appointmentOnly ? 0 : undefined}
              aria-label={appointmentOnly ? `Ouvrir le rendez-vous de ${folder.request.first_name} ${folder.request.last_name}` : undefined}
              onClick={appointmentOnly ? (event) => {
                if ((event.target as HTMLElement).closest("button")) return;
                doAction();
              } : undefined}
              onKeyDown={appointmentOnly ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  doAction();
                }
              } : undefined}
            >
              <div className="bwd-folder-icon"><Icon aria-hidden="true" /></div>
              <div className="bwd-folder-client">
                <strong>{appointmentOnly && !isProject && folder.appointment?.status === "requested" && <em className="bwd-appointment-new">● Nouveau</em>}{folder.request.first_name} {folder.request.last_name}{isProject ? <em className="bwd-project-card-badge">▱ PROJET</em> : appointmentOnly && <em className="bwd-appointment-badge">{appointmentBadge}</em>}</strong>
                <span className={isCompletedProject ? "bwd-completed-project-info" : undefined}>{isCompletedProject ? `${folder.request.service?.title ?? "Première consultation"} · ${folder.request.phone}${folder.appointment?.scheduled_at ? ` · ${date(folder.appointment.scheduled_at)}` : ""}` : folder.request.service?.title ?? "Première consultation"}</span>
                {!isCompletedProject && <small>{folder.request.phone}{appointmentOnly && folder.appointment?.scheduled_at ? ` · ${date(folder.appointment.scheduled_at)}` : ` · Estimation : ${folder.request.estimated_min !== null ? `${money(folder.request.estimated_min)} — ${money(folder.request.estimated_max)} DT` : "sur devis"}`}</small>}
                {appointmentOnly && folder.appointment?.status === "requested" && <i className="bwd-appointment-received">{receivedLabel(folder.appointment.created_at)}</i>}
              </div>
              <div className="bwd-folder-next">
                <b>{state.title}</b>
                <span>{state.text}</span>
              </div>
              <div className="bwd-folder-actions">
                <button type="button" onClick={(event) => { event.stopPropagation(); doAction(); }}>
                  {appointmentOnly ? "Ouvrir" : "Gérer le projet →"}
                </button>
                {isCompletedProject && <button
                  type="button"
                  className="bwd-folder-expand"
                  aria-label={isCompletedProjectExpanded ? "Réduire la carte du projet" : "Afficher la carte complète du projet"}
                  title={isCompletedProjectExpanded ? "Réduire" : "Afficher la carte complète"}
                  aria-expanded={isCompletedProjectExpanded}
                  onClick={(event) => { event.stopPropagation(); setExpandedCompletedProjects((projects) => projects.includes(folder.project!.id) ? projects.filter((id) => id !== folder.project!.id) : [...projects, folder.project!.id]); }}
                ><ChevronDown aria-hidden="true" /></button>}
                <button
                  type="button"
                  className="bwd-folder-delete"
                  onClick={(event) => { event.stopPropagation(); onDeleteFolder(folder); }}
                >
                  Supprimer
                </button>
              </div>
              {appointmentOnly ? (
                <div className={`bwd-appointment-next${isProject ? " bwd-project-next" : ""}`} aria-label="Étape suivante">
                  <span className="bwd-appointment-stage-bars" aria-hidden="true">
                    {Array.from({ length: isProject ? 4 : 3 }, (_, index) => <i key={index} className={index <= activeStep ? "on" : ""} />)}
                  </span>
                  <span><b>Étape {activeStep + 1} sur {isProject ? 4 : 3} :</b> {isProject ? state.text : appointmentStageText}</span>
                </div>
              ) : <ol className="bwd-folder-progress" aria-label="Avancement du dossier">
                {steps.map((label, index) => {
                  const isRejected = rejected && index === 2;
                  const isComplete = !rejected && index < activeStep;
                  const isCurrent = !rejected && index === activeStep;
                  return (
                    <li key={label} className={isRejected ? "rejected" : isComplete ? "complete" : isCurrent ? "current" : ""}>
                      <span>{isRejected ? "×" : isComplete ? "✓" : index + 1}</span>
                      <b>{label}</b>
                    </li>
                  );
                })}
              </ol>}
            </article>
          </Fragment>);
        })}
      </div>
      {!folders.length && <p>Aucun dossier pour le moment.</p>}
      {!!folders.length && !visibleFolders.length && (
        <p className="bwd-no-filter-result">Aucun rendez-vous ne correspond à ces filtres.</p>
      )}
    </section>
  );
}


