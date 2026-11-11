import { Banknote, Bell, CalendarDays, CheckCircle2, FileCheck2, FolderPlus, Hammer, Trophy, XCircle } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AppointmentCreationModal } from "../../components/admin/AppointmentCreationModal";
import { AppointmentModal } from "../../components/admin/AppointmentModal";
import { ClientFoldersPanel } from "../../components/admin/ClientFoldersPanel";
import { ProjectCreationModal, ProjectManagementModal } from "../../components/admin/ProjectModals";
import { QuoteDetailModal } from "../../components/admin/QuoteDetailModal";
import { QuoteModal } from "../../components/admin/QuoteModal";
import { PricingRulesPage } from "./PricingRulesPage";
import { apiUrl } from "../../services/api";

type DashboardStats = {
  quote_requests: { total: number; new: number; contacted: number };
  appointments: { total: number; this_month: number; requested: number; confirmed: number };
  quotes: {
    total: number;
    draft: number;
    sent: number;
    accepted: number;
    rejected: number;
    accepted_total_tnd: number;
  };
  projects: {
    total: number;
    planning: number;
    in_progress: number;
    installation: number;
    ongoing: number;
    completed: number;
  };
  charts: {
    monthly_activity: Array<{ label: string; rendez_vous: number; devis: number }>;
    projects_by_stage: Array<{ label: string; total: number }>;
  };
};
type AdminQuoteRequestImage = {
  id: number;
  original_name: string;
  mime_type: string;
  size: number;
  download_url: string;
};
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
  images?: AdminQuoteRequestImage[];
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
type AppointmentForm = {
  mode: string;
  platform: string;
  scheduled_at: string;
  city: string;
  address: string;
  notes: string;
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
  quote?: {
    quote_number: string;
    quote_request?: {
      id: number;
      first_name: string;
      last_name: string;
      phone: string | null;
      service?: { title: string } | null;
    } | null;
  };
};

type ClientFolder = {
  request: AdminQuoteRequest;
  appointment?: AdminAppointment;
  quote?: AdminQuote;
  project?: AdminProject;
};

export function AdminWorkspace({
  token,
  logout,
}: {
  token: string;
  logout: () => void;
}) {
  const [tab, setTab] = useState<
    | "folders"
    | "dashboard"
    | "requests"
    | "appointments"
    | "quotes"
    | "projects"
    | "pricing"
  >("folders");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [requests, setRequests] = useState<AdminQuoteRequest[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<AdminQuoteRequest | null>(null);
  const [requestImageUrls, setRequestImageUrls] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AdminAppointment | null>(null);
  const [quotes, setQuotes] = useState<AdminQuote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<AdminQuote | null>(null);
  const [quoteSearch, setQuoteSearch] = useState("");
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [busy, setBusy] = useState(false);
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [dismissedReminderIds, setDismissedReminderIds] = useState<Set<number>>(new Set());
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [quoteRequest, setQuoteRequest] = useState<AdminQuoteRequest | null>(
    null,
  );
  const [quoteForm, setQuoteForm] = useState<{
    label: string; quantity: string; unit: string; unit_price: string; dimensions: string;
    discount_enabled: boolean; discount_type: "percent" | "amount"; discount_value: string; discount_reason: string;
    valid_until: string; notes: string;
  }>({
    label: "",
    quantity: "1",
    unit: "pièce",
    unit_price: "",
    dimensions: "",
    discount_enabled: false,
    discount_type: "percent",
    discount_value: "",
    discount_reason: "",
    valid_until: "",
    notes: "",
  });
  const [appointmentRequest, setAppointmentRequest] =
    useState<AdminQuoteRequest | null>(null);
  const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>({
    mode: "on_site",
    platform: "whatsapp",
    scheduled_at: "",
    city: "",
    address: "",
    notes: "",
  });
  const [projectQuote, setProjectQuote] = useState<AdminQuote | null>(null);
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const money = (value: string | number | null | undefined) =>
    new Intl.NumberFormat("fr-TN", { maximumFractionDigits: 3 }).format(
      Number(value ?? 0),
    );
  const date = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat("fr-TN", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(value))
      : "—";
  const filteredQuotes = quotes.filter((quote) =>
    `${quote.quote_number} ${quote.quote_request?.first_name ?? ""} ${quote.quote_request?.last_name ?? ""}`
      .toLocaleLowerCase("fr")
      .includes(quoteSearch.trim().toLocaleLowerCase("fr")),
  );
  const clientFolders: ClientFolder[] = requests
    .map((request) => {
      const appointment = appointments
        .filter((item) => item.quote_request_id === request.id)
        .sort(
          (first, second) =>
            new Date(second.created_at ?? second.scheduled_at ?? 0).getTime() -
            new Date(first.created_at ?? first.scheduled_at ?? 0).getTime(),
        )[0];
      const quote = quotes.find((item) => item.quote_request_id === request.id);
      const project = projects.find((item) =>
        item.quote_id === quote?.id || item.quote?.quote_request?.id === request.id,
      );
      return { request, appointment, quote, project };
    })
    .sort((first, second) => {
      const firstDone = first.project?.status === "completed" || first.project?.status === "cancelled" || first.quote?.status === "rejected";
      const secondDone = second.project?.status === "completed" || second.project?.status === "cancelled" || second.quote?.status === "rejected";
      return Number(firstDone) - Number(secondDone);
    });
  const appointmentReminders = appointments
    .filter((appointment) => appointment.scheduled_at && !dismissedReminderIds.has(appointment.id) && !["completed", "cancelled"].includes(appointment.status))
    .map((appointment) => {
      const scheduled = new Date(appointment.scheduled_at as string);
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8);
      const day = new Date(scheduled.getFullYear(), scheduled.getMonth(), scheduled.getDate());
      const kind = day < startOfToday ? "overdue" : day.getTime() === startOfToday.getTime() ? "today" : day.getTime() === startOfTomorrow.getTime() ? "tomorrow" : day < endOfWeek ? "week" : null;
      return { appointment, kind, scheduled };
    })
    .filter((item): item is { appointment: AdminAppointment; kind: "overdue" | "today" | "tomorrow" | "week"; scheduled: Date } => Boolean(item.kind))
    .sort((first, second) => {
      const priority = { overdue: 0, today: 1, tomorrow: 2, week: 3 };
      return priority[first.kind] - priority[second.kind] || first.scheduled.getTime() - second.scheduled.getTime();
    });
  const pastAppointments = appointments
    .filter((appointment) => appointment.scheduled_at && new Date(appointment.scheduled_at).getTime() < Date.now())
    .sort((first, second) => new Date(second.scheduled_at ?? 0).getTime() - new Date(first.scheduled_at ?? 0).getTime())
    .slice(0, 5);
  const load = async (silent = false) => {
    if (!silent) {
      setBusy(true);
      setError("");
    }
    try {
      const endpoints = [
        "dashboard",
        "quote-requests",
        "appointments",
        "quotes",
        "projects",
      ];
      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          fetch(`${apiUrl}/admin/${endpoint}`, { headers }),
        ),
      );
      if (responses.some((response) => response.status === 401)) {
        logout();
        return;
      }
      if (responses.some((response) => !response.ok))
        throw new Error("Impossible de charger le dashboard.");
      const [
        dashboard,
        quoteRequests,
        appointmentData,
        quoteData,
        projectData,
      ] = await Promise.all(responses.map((response) => response.json()));
      setStats(dashboard.data);
      setRequests(quoteRequests.data ?? []);
      setAppointments(
        [...(appointmentData.data ?? [])].sort(
          (first, second) =>
            new Date(second.created_at ?? 0).getTime() -
            new Date(first.created_at ?? 0).getTime(),
        ),
      );
      setQuotes(quoteData.data ?? []);
      setProjects(projectData.data ?? []);
    } catch (loadError) {
      if (!silent)
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Une erreur est survenue.",
        );
    } finally {
      if (!silent) setBusy(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token]);

  useEffect(() => {
    let active = true;
    const refreshAppointments = async () => {
      try {
        const response = await fetch(`${apiUrl}/admin/appointments`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });
        if (!response.ok || !active) return;
        const data = await response.json();
        const nextAppointments = [...(data.data ?? [])].sort(
          (first: AdminAppointment, second: AdminAppointment) =>
            new Date(second.created_at ?? 0).getTime() -
            new Date(first.created_at ?? 0).getTime(),
        );

        setAppointments((current) => {
          const knownIds = new Set(current.map((appointment) => appointment.id));
          const newest = nextAppointments.find(
            (appointment: AdminAppointment) =>
              !knownIds.has(appointment.id) && appointment.status === "requested",
          );
          if (newest)
            setNotice(`Nouveau rendez-vous reçu : ${newest.first_name} ${newest.last_name}.`);
          return nextAppointments;
        });
      } catch {
        // La prochaine actualisation automatique réessaiera discrètement.
      }
    };

    const intervalId = window.setInterval(refreshAppointments, 5000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [token]);

  useEffect(() => {
    const objectUrls: string[] = [];
    let active = true;

    const loadImages = async () => {
      if (!selectedRequest?.images?.length) {
        setRequestImageUrls([]);
        return;
      }
      const urls = await Promise.all(
        selectedRequest.images.map(async (image) => {
          const response = await fetch(image.download_url, { headers });
          if (!response.ok) return null;
          const url = URL.createObjectURL(await response.blob());
          objectUrls.push(url);
          return url;
        }),
      );
      if (active)
        setRequestImageUrls(urls.filter((url): url is string => Boolean(url)));
    };

    void loadImages();
    return () => {
      active = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedRequest, token]);

  const update = async (path: string, payload: object, success: string) => {
    setBusy(true);
    setError("");
    setNotice("");
    const status = (payload as { status?: string }).status;
    const id = Number(path.split("/").at(-1));
    if (status) {
      if (path.startsWith("quote-requests/"))
        setRequests((current) =>
          current.map((item) => (item.id === id ? { ...item, status } : item)),
        );
      if (path.startsWith("appointments/"))
        setAppointments((current) =>
          current.map((item) => (item.id === id ? { ...item, status } : item)),
        );
      if (path.startsWith("quotes/"))
        setQuotes((current) =>
          current.map((item) => (item.id === id ? { ...item, status } : item)),
        );
      if (path.startsWith("projects/"))
        setProjects((current) =>
          current.map((item) => (item.id === id ? { ...item, status } : item)),
        );
    }
    try {
      const response = await fetch(`${apiUrl}/admin/${path}`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(data?.message ?? "Mise à jour impossible.");
      setNotice(success);
      void load(true);
      return data?.data ?? null;
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Mise à jour impossible.",
      );
      void load(true);
    } finally {
      setBusy(false);
    }
  };

  const deleteFolder = async (folder: ClientFolder) => {
    const clientName = `${folder.request.first_name} ${folder.request.last_name}`.trim();
    const confirmed = window.confirm(
      `Supprimer définitivement le dossier de ${clientName || "ce client"} ?\n\nLe rendez-vous, le devis, le projet et les photos seront supprimés. Cette action est irréversible.`,
    );
    if (!confirmed) return;

    setBusy(true);
    setError("");
    setNotice("");

    // Retire la carte tout de suite : l'admin n'a pas besoin d'actualiser
    // pour voir que son action a été prise en compte.
    setRequests((current) => current.filter((item) => item.id !== folder.request.id));
    setAppointments((current) => current.filter((item) => item.quote_request_id !== folder.request.id));
    setQuotes((current) => current.filter((item) => item.quote_request_id !== folder.request.id));
    setProjects((current) =>
      current.filter((item) => !folder.quote || item.quote_id !== folder.quote.id),
    );
    setSelectedAppointment(null);
    setSelectedQuote(null);
    setSelectedProject(null);

    try {
      const response = await fetch(
        `${apiUrl}/admin/quote-requests/${folder.request.id}`,
        { method: "DELETE", headers },
      );
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? "Suppression impossible.");
      }

      setNotice("Dossier supprimé définitivement.");
      void load(true);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Suppression impossible.",
      );
      void load(true);
    } finally {
      setBusy(false);
    }
  };

  const openQuote = (request: AdminQuoteRequest) => {
    setQuoteRequest(request);
    const estimatedAverage =
      (Number(request.estimated_min ?? 0) +
        Number(request.estimated_max ?? 0)) /
      2;
    setQuoteForm({
      label: request.service?.title ?? "Prestation Ben Wada Déco",
      quantity: String(request.quantity || 1),
      unit: request.unit || "pièce",
      unit_price: String(
        estimatedAverage && request.quantity
          ? estimatedAverage / Number(request.quantity)
          : 0,
      ),
      dimensions: request.dimensions ?? "",
      discount_enabled: false,
      discount_type: "percent",
      discount_value: "",
      discount_reason: "",
      valid_until: "",
      notes: "",
    });
  };

  const openQuoteForAppointment = async (appointment: AdminAppointment) => {
    setError("");
    let quoteAppointment = appointment;

    if (!quoteAppointment.quote_request_id) {
      setBusy(true);
      try {
        const response = await fetch(
          `${apiUrl}/admin/appointments/${appointment.id}/quote-request`,
          { method: "POST", headers: { ...headers, "Content-Type": "application/json" } },
        );
        const data = await response.json().catch(() => null);
        if (!response.ok)
          throw new Error(data?.message ?? "Création du dossier prospect impossible.");
        quoteAppointment = data.data as AdminAppointment;
        setSelectedAppointment(quoteAppointment);
        setAppointments((current) =>
          current.map((item) =>
            item.id === quoteAppointment.id ? quoteAppointment : item,
          ),
        );
      } catch (quoteRequestError) {
        setError(
          quoteRequestError instanceof Error
            ? quoteRequestError.message
            : "Création du dossier prospect impossible.",
        );
        return;
      } finally {
        setBusy(false);
      }
    }

    const existingRequest = quoteAppointment.quote_request_id
      ? requests.find((request) => request.id === quoteAppointment.quote_request_id)
      : undefined;

    if (existingRequest) {
      openQuote(existingRequest);
      return;
    }

    // Le dossier peut venir d'être créé pour un ancien rendez-vous direct et
    // ne pas encore être présent dans la liste locale.
    openQuote({
      id: quoteAppointment.quote_request_id as number,
      first_name: quoteAppointment.first_name,
      last_name: quoteAppointment.last_name,
      phone: quoteAppointment.phone,
      email: quoteAppointment.email,
      city: quoteAppointment.city,
      address: quoteAppointment.address,
      service_type: null,
      quantity: quoteAppointment.quote_request?.quantity ?? 1,
      unit: quoteAppointment.quote_request?.unit ?? "pièce",
      estimated_min: quoteAppointment.quote_request?.estimated_min ?? null,
      estimated_max: quoteAppointment.quote_request?.estimated_max ?? null,
      description:
        quoteAppointment.quote_request?.description ??
        quoteAppointment.notes ??
        "Prestation à préciser après le rendez-vous.",
      dimensions: quoteAppointment.quote_request?.dimensions ?? null,
      approximate_budget: null,
      status: "new",
      created_at: null,
      service: quoteAppointment.quote_request?.service ?? undefined,
    });
  };

  const openAppointment = (request: AdminQuoteRequest) => {
    setAppointmentRequest(request);
    setAppointmentForm({
      mode: "on_site",
      platform: "whatsapp",
      scheduled_at: "",
      city: request.city ?? "",
      address: request.address ?? "",
      notes: "",
    });
  };

  const createAppointment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!appointmentRequest) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        quote_request_id: appointmentRequest.id,
        first_name: appointmentRequest.first_name,
        last_name: appointmentRequest.last_name,
        phone: appointmentRequest.phone,
        email: appointmentRequest.email || null,
        city: appointmentForm.mode === "on_site" ? appointmentForm.city : null,
        address:
          appointmentForm.mode === "on_site" ? appointmentForm.address : null,
        appointment_type: "visit",
        appointment_mode: appointmentForm.mode,
        remote_platform:
          appointmentForm.mode === "remote" ? appointmentForm.platform : null,
        scheduled_at: appointmentForm.scheduled_at,
        status: "confirmed",
        notes: appointmentForm.notes || null,
      };
      const response = await fetch(`${apiUrl}/admin/appointments`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(data?.message ?? "Création du rendez-vous impossible.");
      setAppointmentRequest(null);
      setNotice("Rendez-vous créé et confirmé.");
      await load();
    } catch (appointmentError) {
      setError(
        appointmentError instanceof Error
          ? appointmentError.message
          : "Création du rendez-vous impossible.",
      );
    } finally {
      setBusy(false);
    }
  };

  const createQuote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!quoteRequest) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        quote_request_id: quoteRequest.id,
        items: [
          {
            label: quoteForm.label,
            quantity: Number(quoteForm.quantity),
            unit: quoteForm.unit,
            unit_price: Number(quoteForm.unit_price),
          },
        ],
        discount: quoteForm.discount_enabled
          ? quoteForm.discount_type === "percent"
            ? (Number(quoteForm.quantity) * Number(quoteForm.unit_price) * Number(quoteForm.discount_value || 0)) / 100
            : Number(quoteForm.discount_value || 0)
          : 0,
        valid_until: quoteForm.valid_until || null,
        notes: [quoteForm.dimensions ? `Dimensions / mesures : ${quoteForm.dimensions}` : "", quoteForm.discount_enabled && quoteForm.discount_reason ? `Motif de la remise : ${quoteForm.discount_reason}` : "", quoteForm.notes].filter(Boolean).join("\n\n") || null,
      };
      const response = await fetch(`${apiUrl}/admin/quotes`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(data?.message ?? "Création du devis impossible.");
      const createdQuote = data.data as AdminQuote;
      setQuotes((current) => [createdQuote, ...current]);
      setQuoteRequest(null);
      setSelectedAppointment(null);
      setSelectedQuote(createdQuote);
      setNotice("Devis créé. Vérifiez le PDF, puis envoyez-le au client.");
      void load(true);
    } catch (quoteError) {
      setError(
        quoteError instanceof Error
          ? quoteError.message
          : "Création du devis impossible.",
      );
    } finally {
      setBusy(false);
    }
  };

  const downloadPdf = async (quote: AdminQuote) => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${apiUrl}/admin/quotes/${quote.id}/pdf`, {
        headers,
      });
      if (!response.ok) throw new Error("Impossible de générer le PDF.");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(await response.blob());
      link.download = `devis-${quote.quote_number}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (pdfError) {
      setError(
        pdfError instanceof Error
          ? pdfError.message
          : "Téléchargement impossible.",
      );
    } finally {
      setBusy(false);
    }
  };

  const createProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectQuote) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(
        `${apiUrl}/admin/quotes/${projectQuote.id}/project`,
        {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({
            title: projectTitle || `Projet ${projectQuote.quote_number}`,
          }),
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(data?.message ?? "Création du projet impossible.");
      const project = data.data as AdminProject;
      setProjectQuote(null);
      setProjectTitle("");
      setSelectedProject(project);
      setNotice(
        "Projet créé. Toute progression de son statut enverra un e-mail au client.",
      );
      await load();
    } catch (projectError) {
      setError(
        projectError instanceof Error
          ? projectError.message
          : "Création du projet impossible.",
      );
    } finally {
      setBusy(false);
    }
  };

  const menu = [
    ["folders", "Les rendez-vous"],
    ["dashboard", "Dashboard"],
    ["appointments", "Rendez-vous"],
    ["quotes", "Devis PDF"],
    ["projects", "Projets"],
    ["pricing", "Règles de prix"],
  ] as const;
  const sidebarMenu = [
    ["folders", "Les rendez-vous"],
    ["dashboard", "Dashboard"],
    ["pricing", "Règles de prix"],
  ] as const;
  return (
    <main className="bwd-admin-page">
      <div className="bwd-admin-shell bwd-admin-app">
        <aside className="bwd-admin-sidebar">
          <Link to="/" className="bwd-admin-logo">
            Ben Wada
            <br />
            Déco
          </Link>
          <p>Administration</p>
          <nav>
            {sidebarMenu.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={tab === key ? "active" : ""}
              >
                {label}
              </button>
            ))}
          </nav>
          <button className="bwd-admin-logout" onClick={logout}>
            Déconnexion
          </button>
        </aside>
        <section className="bwd-admin-content">
          <header className="bwd-admin-header">
            <div>
              <p className="bwd-eyebrow">Espace professionnel</p>
              <h1>{menu.find(([key]) => key === tab)?.[1]}</h1>
            </div>
            <button
              type="button"
              className="bwd-outline-button"
              onClick={() => void load()}
              disabled={busy}
            >
              Actualiser
            </button>
            <div className="bwd-reminder-menu">
              <button type="button" className="bwd-reminder-bell" onClick={() => setRemindersOpen((open) => !open)} aria-label="Voir les rappels de rendez-vous">
                <Bell aria-hidden="true" />
                {appointmentReminders.length > 0 && <span>{appointmentReminders.length}</span>}
              </button>
              {remindersOpen && <div className="bwd-reminder-dropdown">
                <strong>Rappels rendez-vous</strong>
                {appointmentReminders.length ? appointmentReminders.slice(0, 5).map(({ appointment, kind }) => <div key={appointment.id} className={`bwd-reminder-dropdown-item bwd-reminder-${kind}`}><button type="button" onClick={() => { setSelectedAppointment(appointment); setRemindersOpen(false); }}><b>{kind === "overdue" ? "En retard" : kind === "today" ? "Aujourd’hui" : kind === "tomorrow" ? "Demain" : "Cette semaine"}</b><span>{appointment.first_name} {appointment.last_name} · {date(appointment.scheduled_at)}</span></button><button type="button" className="bwd-reminder-dropdown-delete" aria-label={`Masquer le rappel de ${appointment.first_name} ${appointment.last_name}`} onClick={() => setDismissedReminderIds((current) => new Set(current).add(appointment.id))}>×</button></div>) : <p>Aucun rappel pour le moment.</p>}
                {pastAppointments.length > 0 && <div className="bwd-reminder-dropdown-past"><b>Rendez-vous passés</b>{pastAppointments.map((appointment) => <button key={appointment.id} type="button" onClick={() => { setSelectedAppointment(appointment); setRemindersOpen(false); }}><strong>{appointment.first_name} {appointment.last_name}</strong><span>{date(appointment.scheduled_at)} · {appointment.status === "completed" ? "Terminé" : appointment.status === "cancelled" ? "Annulé" : "À traiter"}</span></button>)}</div>}
              </div>}
            </div>
          </header>
          {error && <p className="bwd-admin-error">{error}</p>}
          {notice && <p className="bwd-form-success">{notice}</p>}
          {tab === "folders" && (
            <ClientFoldersPanel
              folders={clientFolders.filter((folder) => Boolean(folder.appointment))}
              date={date}
              money={money}
              onOpenAppointment={setSelectedAppointment}
              onCreateAppointment={(request) => {
                openAppointment(request);
              }}
              onOpenQuote={setSelectedQuote}
              onCreateProject={(quote) => {
                setProjectQuote(quote);
                setProjectTitle(`Projet ${quote.quote_number}`);
              }}
              onOpenProject={setSelectedProject}
              onDeleteFolder={(folder) => void deleteFolder(folder)}
              appointmentOnly
            />
          )}
          {tab === "dashboard" && (
            <section className="bwd-dashboard">
              {appointmentReminders.length > 0 && <section className="bwd-admin-reminders">
                <div><p className="bwd-eyebrow">À ne pas oublier</p><h2>Rappels rendez-vous</h2></div>
                <span>{appointmentReminders.length} rappel{appointmentReminders.length > 1 ? "s" : ""}</span>
                {appointmentReminders.length > 0 && <div className="bwd-reminder-list">
                  {appointmentReminders.map(({ appointment, kind }) => <article key={appointment.id} className={`bwd-reminder-card bwd-reminder-${kind}`}>
                    <div><b>{kind === "overdue" ? "En retard" : kind === "today" ? "Aujourd’hui" : kind === "tomorrow" ? "Demain" : "Cette semaine"}</b><strong>{appointment.first_name} {appointment.last_name}</strong><span>{date(appointment.scheduled_at)} · {appointment.quote_request?.service?.title ?? "Première consultation"}</span></div>
                    <div className="bwd-reminder-actions"><button type="button" onClick={() => setSelectedAppointment(appointment)}>Ouvrir →</button><button type="button" className="bwd-reminder-delete" onClick={() => setDismissedReminderIds((current) => new Set(current).add(appointment.id))}>Supprimer</button></div>
                  </article>)}
                </div>}
              </section>}
              <div className="bwd-dashboard-summary">
                <div><p className="bwd-eyebrow">Vue d’ensemble</p><h2>Votre activité en un coup d’œil</h2><span>Suivez les rendez-vous, devis et projets de votre atelier.</span></div>
                <button type="button" className="bwd-dashboard-appointments" onClick={() => setTab("folders")}>Voir les rendez-vous →</button>
              </div>
              <div className="bwd-stat-grid bwd-dashboard-stats">
                <article className="bwd-stat-appointments">
                  <i><CalendarDays aria-hidden="true" /></i><span>Rendez-vous ce mois</span>
                  <strong>{stats?.appointments.this_month ?? "—"}</strong>
                  <small>{stats?.appointments.confirmed ?? 0} confirmé(s)</small>
                </article>
                <article className="bwd-stat-accepted">
                  <i><FileCheck2 aria-hidden="true" /></i><span>Devis acceptés</span>
                  <strong>{stats?.quotes.accepted ?? "—"}</strong>
                  <small>clients qui ont validé</small>
                </article>
                <article className="bwd-stat-rejected">
                  <i><XCircle aria-hidden="true" /></i><span>Devis refusés</span>
                  <strong>{stats?.quotes.rejected ?? "—"}</strong>
                  <small>sans suite</small>
                </article>
                <article className="bwd-stat-revenue">
                  <i><Banknote aria-hidden="true" /></i><span>Chiffre d’affaires</span>
                  <strong>{money(stats?.quotes.accepted_total_tnd)} DT</strong>
                  <small>devis acceptés</small>
                </article>
                <article className="bwd-stat-projects">
                  <i><Hammer aria-hidden="true" /></i><span>Projets en cours</span>
                  <strong>{stats?.projects.ongoing ?? "—"}</strong>
                  <small>préparation, travaux ou installation</small>
                </article>
                <article className="bwd-stat-completed">
                  <i><Trophy aria-hidden="true" /></i><span>Projets terminés</span>
                  <strong>{stats?.projects.completed ?? "—"}</strong>
                  <small>réalisations clôturées</small>
                </article>
              </div>
              <div className="bwd-admin-dashboard-grid">
                <article className="bwd-admin-panel">
                  <h2>Activité récente</h2>
                  <p>
                    <strong>{requests.length}</strong> demande(s) de devis
                    reçue(s)
                  </p>
                  <p>
                    <strong>{appointments.length}</strong> rendez-vous
                    enregistré(s)
                  </p>
                  <p>
                    <strong>{projects.length}</strong> projet(s) suivi(s)
                  </p>
                </article>
                <article className="bwd-admin-panel">
                  <h2>Suivi client par e-mail</h2>
                  <p>
                    Lorsqu’un projet passe à « En préparation », « En cours », «
                    Installation », « Terminé » ou « Annulé », Laravel envoie
                    automatiquement un e-mail au client.
                  </p>
                  <button
                    className="bwd-dark-button"
                    onClick={() => setTab("projects")}
                  >
                    Gérer les projets
                  </button>
                </article>
              </div>
              <div className="bwd-dashboard-charts">
                <article className="bwd-admin-panel bwd-chart-card">
                  <div className="bwd-chart-heading">
                    <div>
                      <p className="bwd-eyebrow">Les 6 derniers mois</p>
                      <h2>Rendez-vous & devis</h2>
                    </div>
                    <span><i className="bwd-chart-dot appointments" /> Rendez-vous <i className="bwd-chart-dot quotes" /> Devis</span>
                  </div>
                  <div className="bwd-chart-canvas">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats?.charts.monthly_activity ?? []} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke="#e6e6e2" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#68746c", fontSize: 11 }} />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#68746c", fontSize: 11 }} />
                        <Tooltip contentStyle={{ border: "1px solid #d8dfdb", borderRadius: 0, fontSize: 12 }} />
                        <Line type="monotone" dataKey="rendez_vous" name="Rendez-vous" stroke="#2f88b8" strokeWidth={3} dot={{ r: 4, fill: "#2f88b8" }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="devis" name="Devis" stroke="#207642" strokeWidth={3} dot={{ r: 4, fill: "#207642" }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </article>
                <article className="bwd-admin-panel bwd-chart-card">
                  <div className="bwd-chart-heading">
                    <div>
                      <p className="bwd-eyebrow">Vue instantanée</p>
                      <h2>Projets par étape</h2>
                    </div>
                  </div>
                  <div className="bwd-chart-canvas">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats?.charts.projects_by_stage ?? []} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke="#e6e6e2" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#68746c", fontSize: 10 }} />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#68746c", fontSize: 11 }} />
                        <Tooltip cursor={{ fill: "#f0f5f1" }} contentStyle={{ border: "1px solid #d8dfdb", borderRadius: 0, fontSize: 12 }} />
                        <Bar dataKey="total" name="Projets" fill="#c95f43" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </article>
              </div>
            </section>
          )}
          {tab === "requests" && (
            <section>
              {appointmentRequest && (
                <form
                  className="bwd-admin-form bwd-admin-quote-form"
                  onSubmit={createAppointment}
                >
                  <div className="bwd-admin-form-title">
                    <div>
                      <h2>Créer un rendez-vous</h2>
                      <small>
                        {appointmentRequest.first_name}{" "}
                        {appointmentRequest.last_name} ·{" "}
                        {appointmentRequest.phone}
                      </small>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAppointmentRequest(null)}
                    >
                      Annuler
                    </button>
                  </div>
                  <div>
                    <label>
                      Mode de rendez-vous
                      <select
                        value={appointmentForm.mode}
                        onChange={(event) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            mode: event.target.value,
                          })
                        }
                      >
                        <option value="on_site">
                          Visite sur place — payante
                        </option>
                        <option value="remote">À distance — gratuit</option>
                      </select>
                    </label>
                    {appointmentForm.mode === "remote" ? (
                      <label>
                        Plateforme
                        <select
                          value={appointmentForm.platform}
                          onChange={(event) =>
                            setAppointmentForm({
                              ...appointmentForm,
                              platform: event.target.value,
                            })
                          }
                        >
                          <option value="whatsapp">WhatsApp — gratuit</option>
                          <option value="zoom">Zoom — gratuit</option>
                        </select>
                      </label>
                    ) : (
                      <label>
                        Ville
                        <input
                          value={appointmentForm.city}
                          onChange={(event) =>
                            setAppointmentForm({
                              ...appointmentForm,
                              city: event.target.value,
                            })
                          }
                          required
                        />
                      </label>
                    )}
                  </div>
                  {appointmentForm.mode === "on_site" && (
                    <label>
                      Adresse de la visite
                      <input
                        value={appointmentForm.address}
                        onChange={(event) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            address: event.target.value,
                          })
                        }
                        required
                      />
                    </label>
                  )}
                  <label>
                    Date et heure
                    <input
                      type="datetime-local"
                      value={appointmentForm.scheduled_at}
                      onChange={(event) =>
                        setAppointmentForm({
                          ...appointmentForm,
                          scheduled_at: event.target.value,
                        })
                      }
                      required
                    />
                  </label>
                  <label>
                    Notes pour le rendez-vous
                    <textarea
                      value={appointmentForm.notes}
                      onChange={(event) =>
                        setAppointmentForm({
                          ...appointmentForm,
                          notes: event.target.value,
                        })
                      }
                      placeholder="Dimensions à confirmer, matériaux souhaités, contraintes…"
                    />
                  </label>
                  <p className="bwd-admin-email-note">
                    La visite sur place est indiquée comme payante. WhatsApp et
                    Zoom sont gratuits.
                  </p>
                  <button className="bwd-dark-button" disabled={busy}>
                    Créer et confirmer le rendez-vous
                  </button>
                </form>
              )}
              {selectedRequest ? (
                <section className="bwd-admin-panel bwd-request-detail">
                  <button
                    className="bwd-back-button"
                    onClick={() => {
                      setSelectedRequest(null);
                      setAppointmentRequest(null);
                    }}
                  >
                    ← Toutes les demandes
                  </button>
                  <div className="bwd-request-detail-head">
                    <div>
                      <p className="bwd-eyebrow">
                        Demande #{selectedRequest.id}
                      </p>
                      <h2>
                        {selectedRequest.first_name} {selectedRequest.last_name}
                      </h2>
                    </div>
                    <select
                      className={`bwd-status bwd-status-${selectedRequest.status}`}
                      value={selectedRequest.status}
                      onChange={(event) => {
                        const status = event.target.value;
                        setSelectedRequest({ ...selectedRequest, status });
                        void update(
                          `quote-requests/${selectedRequest.id}`,
                          { status },
                          "Statut de la demande mis à jour.",
                        );
                      }}
                    >
                      <option value="new">Nouvelle</option>
                      <option value="contacted">Client contacté</option>
                    </select>
                  </div>
                  <div className="bwd-request-detail-grid">
                    <article>
                      <h3>Coordonnées</h3>
                      <p>
                        <strong>Téléphone</strong>
                        {selectedRequest.phone}
                      </p>
                      <p>
                        <strong>E-mail</strong>
                        {selectedRequest.email ?? "Non renseigné"}
                      </p>
                      <p>
                        <strong>Ville</strong>
                        {selectedRequest.city ?? "Non renseignée"}
                      </p>
                      <p>
                        <strong>Adresse</strong>
                        {selectedRequest.address ?? "Non renseignée"}
                      </p>
                    </article>
                    <article>
                      <h3>Projet demandé</h3>
                      <p>
                        <strong>Service</strong>
                        {selectedRequest.service?.title ?? "Non renseigné"}
                      </p>
                      <p>
                        <strong>Quantité</strong>
                        {selectedRequest.quantity} {selectedRequest.unit ?? ""}
                      </p>
                      <p>
                        <strong>Dimensions</strong>
                        {selectedRequest.dimensions ?? "Non renseignées"}
                      </p>
                      <p>
                        <strong>Budget envisagé</strong>
                        {selectedRequest.approximate_budget
                          ? `${money(selectedRequest.approximate_budget)} DT`
                          : "Non renseigné"}
                      </p>
                    </article>
                  </div>
                  <article className="bwd-request-description">
                    <h3>Description du client</h3>
                    <p>{selectedRequest.description}</p>
                  </article>
                  {requestImageUrls.length > 0 && (
                    <section className="bwd-request-images">
                      <h3>Photos envoyées</h3>
                      <div>
                        {requestImageUrls.map((url, index) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={url}
                              alt={`Photo du projet ${index + 1}`}
                            />
                          </a>
                        ))}
                      </div>
                    </section>
                  )}
                  <div className="bwd-request-detail-actions">
                    <button onClick={() => openAppointment(selectedRequest)}>
                      Créer un rendez-vous
                    </button>
                    {selectedRequest.status === "contacted" && (
                      <button
                        className="bwd-dark-button bwd-create-quote-button"
                        onClick={() => openQuote(selectedRequest)}
                      >
                        Créer le devis
                      </button>
                    )}
                    <small>
                      Contactez le client, puis passez le statut à « Client
                      contacté » pour créer son devis final.
                    </small>
                  </div>
                </section>
              ) : (
                <section className="bwd-admin-panel">
                  <h2>Demandes reçues</h2>
                  <p>
                    Ouvrez une demande pour consulter les informations complètes
                    du client et préparer la suite.
                  </p>
                  <div className="bwd-admin-list">
                    {requests.map((request) => (
                      <article key={request.id}>
                        <div>
                          <strong>
                            {request.first_name} {request.last_name}
                          </strong>
                          <span>
                            {request.service?.title ?? "Service"} ·{" "}
                            {request.quantity} {request.unit ?? ""}
                          </span>
                          <small>
                            {request.phone} · {date(request.created_at)}
                          </small>
                        </div>
                        <div className="bwd-admin-actions">
                          <button onClick={() => setSelectedRequest(request)}>
                            Voir la demande
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                  {!requests.length && <p>Aucune demande pour le moment.</p>}
                </section>
              )}
            </section>
          )}
          {tab === "appointments" && (
            <ClientFoldersPanel
              folders={clientFolders.filter((folder) => Boolean(folder.appointment))}
              date={date}
              money={money}
              onOpenAppointment={setSelectedAppointment}
              onCreateAppointment={(request) => {
                openAppointment(request);
              }}
              onOpenQuote={setSelectedQuote}
              onCreateProject={(quote) => {
                setProjectQuote(quote);
                setProjectTitle(`Projet ${quote.quote_number}`);
              }}
              onOpenProject={setSelectedProject}
              onDeleteFolder={(folder) => void deleteFolder(folder)}
              appointmentOnly
            />
          )}
          {selectedAppointment && (
            <AppointmentModal
              appointment={selectedAppointment}
              date={date}
              busy={busy}
              onClose={() => setSelectedAppointment(null)}
              onUpdate={(status) => {
                setSelectedAppointment({ ...selectedAppointment, status });
                void update(
                  "appointments/" + selectedAppointment.id,
                  { status },
                  "Étape du rendez-vous validée.",
                ).then((updatedAppointment) => {
                  if (updatedAppointment)
                    setSelectedAppointment(updatedAppointment as AdminAppointment);
                });
              }}
              onCreateQuote={() => openQuoteForAppointment(selectedAppointment)}
            />
          )}
          {appointmentRequest && (
            <AppointmentCreationModal
              request={appointmentRequest}
              form={appointmentForm}
              setForm={setAppointmentForm}
              busy={busy}
              onClose={() => setAppointmentRequest(null)}
              onSubmit={createAppointment}
            />
          )}
          {quoteRequest && (
            <QuoteModal
              request={quoteRequest}
              form={quoteForm}
              setForm={setQuoteForm}
              busy={busy}
              onClose={() => setQuoteRequest(null)}
              onSubmit={createQuote}
            />
          )}
          {tab === "quotes" && (
            <section>
              {quoteRequest && (
                <form
                  className="bwd-admin-form bwd-admin-quote-form"
                  onSubmit={createQuote}
                >
                  <div className="bwd-admin-form-title">
                    <h2>
                      Créer le devis pour {quoteRequest.first_name}{" "}
                      {quoteRequest.last_name}
                    </h2>
                    <button type="button" onClick={() => setQuoteRequest(null)}>
                      Annuler
                    </button>
                  </div>
                  <div>
                    <label>
                      Prestation
                      <input
                        value={quoteForm.label}
                        onChange={(event) =>
                          setQuoteForm({
                            ...quoteForm,
                            label: event.target.value,
                          })
                        }
                        required
                      />
                    </label>
                    <label>
                      Quantité
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={quoteForm.quantity}
                        onChange={(event) =>
                          setQuoteForm({
                            ...quoteForm,
                            quantity: event.target.value,
                          })
                        }
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Unité
                      <input
                        value={quoteForm.unit}
                        onChange={(event) =>
                          setQuoteForm({
                            ...quoteForm,
                            unit: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Prix unitaire (DT)
                      <input
                        type="number"
                        min="0"
                        step="0.001"
                        value={quoteForm.unit_price}
                        onChange={(event) =>
                          setQuoteForm({
                            ...quoteForm,
                            unit_price: event.target.value,
                          })
                        }
                        required
                      />
                    </label>
                  </div>
                  <label>
                    Valide jusqu’au
                    <input
                      type="date"
                      value={quoteForm.valid_until}
                      onChange={(event) =>
                        setQuoteForm({
                          ...quoteForm,
                          valid_until: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Notes
                    <textarea
                      value={quoteForm.notes}
                      onChange={(event) =>
                        setQuoteForm({
                          ...quoteForm,
                          notes: event.target.value,
                        })
                      }
                    />
                  </label>
                  <button className="bwd-dark-button" disabled={busy}>
                    Créer le devis
                  </button>
                </form>
              )}
              <section className="bwd-admin-panel">
                <h2>Devis finaux</h2>
                <p>
                  En passant un devis à « Envoyé », son PDF est expédié
                  automatiquement par e-mail au client.
                </p>
                <input
                  className="bwd-admin-search"
                  value={quoteSearch}
                  onChange={(event) => setQuoteSearch(event.target.value)}
                  placeholder="Rechercher par nom ou numéro de devis…"
                  aria-label="Rechercher un devis"
                />
                <div className="bwd-admin-list">
                  {filteredQuotes.map((quote) => (
                    <article key={quote.id}>
                      <div>
                        <strong>{quote.quote_number}</strong>
                        <span>
                          {quote.quote_request
                            ? `${quote.quote_request.first_name} ${quote.quote_request.last_name}`
                            : "Client non renseigné"}{" "}
                          · {money(quote.total)} {quote.currency}
                        </span>
                        <small>
                          {quote.status === "draft"
                            ? "À envoyer au client"
                            : quote.status === "sent"
                              ? "En attente de la réponse du client"
                              : quote.status === "accepted"
                                ? "Devis accepté"
                                : "Devis refusé"}
                        </small>
                      </div>
                      <div className="bwd-admin-actions">
                        {quote.status === "draft" ? (
                          <button
                            className="bwd-send-quote-button"
                            onClick={() =>
                              void update(
                                `quotes/${quote.id}`,
                                { status: "sent" },
                                "Le devis PDF a été envoyé par e-mail au client si son adresse est renseignée.",
                              )
                            }
                          >
                            ✉ Envoyer le devis
                          </button>
                        ) : quote.status === "sent" ? (
                          <>
                            <button
                              className="bwd-quote-accept"
                              onClick={() =>
                                void update(
                                  `quotes/${quote.id}`,
                                  { status: "accepted" },
                                  "Devis marqué comme accepté. Vous pouvez maintenant créer le projet.",
                                )
                              }
                            >
                              ✓ Accepté
                            </button>
                            <button
                              className="bwd-quote-reject"
                              onClick={() =>
                                void update(
                                  `quotes/${quote.id}`,
                                  { status: "rejected" },
                                  "Devis marqué comme refusé.",
                                )
                              }
                            >
                              Refusé
                            </button>
                          </>
                        ) : (
                          <span className={`bwd-status bwd-status-${quote.status}`}>
                            {quote.status === "accepted" ? "Accepté" : "Refusé"}
                          </span>
                        )}
                        <button onClick={() => setSelectedQuote(quote)}>
                          Voir le dossier
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                {!quotes.length && (
                  <p>Créez un devis depuis une demande reçue.</p>
                )}
                {quotes.length > 0 && !filteredQuotes.length && (
                  <p>Aucun devis ne correspond à cette recherche.</p>
                )}
              </section>
            </section>
          )}
          {selectedQuote && (
            <QuoteDetailModal
              quote={selectedQuote}
              money={money}
              date={date}
              busy={busy}
              onClose={() => setSelectedQuote(null)}
              onStatusChange={(status) => {
                setSelectedQuote({ ...selectedQuote, status });
                void update(
                  `quotes/${selectedQuote.id}`,
                  { status },
                  status === "sent"
                    ? "Devis envoyé au client. Attendez maintenant sa réponse."
                    : status === "accepted"
                      ? "Devis accepté. Vous pouvez créer le projet."
                      : "Devis marqué comme refusé.",
                );
              }}
              onDownload={() => void downloadPdf(selectedQuote)}
              onCreateProject={() => {
                setProjectQuote(selectedQuote);
                setProjectTitle(`Projet ${selectedQuote.quote_number}`);
                setSelectedQuote(null);
              }}
            />
          )}
          {projectQuote && (
            <ProjectCreationModal
              quote={projectQuote}
              title={projectTitle}
              setTitle={setProjectTitle}
              busy={busy}
              onClose={() => setProjectQuote(null)}
              onSubmit={createProject}
            />
          )}
          {selectedProject && (
            <ProjectManagementModal
              project={selectedProject}
              busy={busy}
              onClose={() => setSelectedProject(null)}
              onAdvance={(status) => {
                setSelectedProject({ ...selectedProject, status });
                void update(
                  `projects/${selectedProject.id}`,
                  { status },
                  `Projet passé à l’étape « ${status === "in_progress" ? "Travaux en cours" : status === "installation" ? "Installation" : "Terminé"} » : le client sera informé par e-mail.`,
                );
              }}
            />
          )}
          {tab === "projects" && (
            <section>
              {projectQuote && (
                <form
                  className="bwd-admin-form bwd-admin-quote-form bwd-project-creation"
                  onSubmit={createProject}
                >
                  <div className="bwd-admin-form-title">
                    <div>
                      <p className="bwd-eyebrow">Dernière étape</p>
                      <h2>Créer le projet</h2>
                    </div>
                    <button type="button" onClick={() => setProjectQuote(null)}>
                      Annuler
                    </button>
                  </div>
                  <div className="bwd-project-steps" aria-label="Étapes de création du projet">
                    <div className="complete">
                      <CheckCircle2 aria-hidden="true" />
                      <span><b>1. Devis accepté</b><small>Fait</small></span>
                    </div>
                    <div className="current">
                      <FolderPlus aria-hidden="true" />
                      <span><b>2. Donner un nom</b><small>Écrivez un nom simple</small></span>
                    </div>
                    <div>
                      <CheckCircle2 aria-hidden="true" />
                      <span><b>3. Créer</b><small>Le suivi commence</small></span>
                    </div>
                  </div>
                  <div className="bwd-project-client-summary">
                    <strong>Client : {projectQuote.quote_request?.first_name ?? ""} {projectQuote.quote_request?.last_name ?? ""}</strong>
                    <span>Devis {projectQuote.quote_number} · {money(projectQuote.total)} {projectQuote.currency}</span>
                  </div>
                  <label>
                    ✎ Nom du projet
                    <input
                      value={projectTitle}
                      onChange={(event) => setProjectTitle(event.target.value)}
                      placeholder="Ex. Salon de Mme Ben Salem"
                      required
                    />
                  </label>
                  <p className="bwd-admin-email-note">
                    Après ce clic, le projet est prêt à suivre. Le client recevra un e-mail quand vous avancerez les étapes.
                  </p>
                  <button className="bwd-dark-button bwd-create-project-button" disabled={busy}>
                    <FolderPlus aria-hidden="true" /> {busy ? "Création…" : "Créer le projet →"}
                  </button>
                </form>
              )}
              <section className="bwd-admin-panel bwd-projects-panel">
                <h2>Suivi des projets</h2>
                <div className="bwd-project-card-list">
                  {projects.map((project) => {
                    const request = project.quote?.quote_request;
                    const stage = project.status === "planning" ? 0 : project.status === "completed" ? 2 : 1;
                    const stageLabel = project.status === "planning" ? "Préparation" : project.status === "completed" ? "Projet terminé" : project.status === "cancelled" ? "Projet annulé" : project.status === "installation" ? "Installation" : "Travaux en cours";
                    return <article key={project.id} className={`bwd-project-card bwd-project-${project.status}`}>
                      <div className="bwd-project-card-main">
                        <strong>{request ? `${request.first_name} ${request.last_name}` : project.title}</strong>
                        <span className="bwd-project-pill">▱ PROJET</span>
                        <em className={`bwd-project-status bwd-project-status-${project.status}`}>{stageLabel}</em>
                        <p>{request?.service?.title ?? project.title}</p>
                        <small>{request?.phone ?? project.quote?.quote_number ?? "Devis"} · {project.start_date ? date(project.start_date) : "Date à définir"}</small>
                      </div>
                      <button type="button" className="bwd-project-open" onClick={() => setSelectedProject(project)}>Ouvrir</button>
                      <div className="bwd-project-progress-line"><span aria-hidden="true">{[0, 1, 2].map((index) => <i key={index} className={index <= stage ? "on" : ""} />)}</span><b>Étape {stage + 1} sur 3 :</b> {stageLabel}</div>
                    </article>;
                  })}
                </div>
                {!projects.length && (
                  <p>
                    Un projet peut être créé après l’acceptation d’un devis.
                  </p>
                )}
              </section>
            </section>
          )}
          {tab === "pricing" && <PricingRulesPage token={token} />}
        </section>
      </div>
    </main>
  );
}


