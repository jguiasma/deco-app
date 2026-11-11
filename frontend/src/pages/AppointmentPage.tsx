import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Page } from "../components/Page";
import { apiUrl, readApiError } from "../services/api";

type ProjectDraft = { fields: Record<string, string>; photos: File[] };

export function AppointmentPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const quoteRequestId = searchParams.get("demande");
  const projectDraft = (location.state as { projectDraft?: ProjectDraft } | null)?.projectDraft;
  const isFromEstimate = Boolean(projectDraft || quoteRequestId);
  const [fields, setFields] = useState(() => ({ first_name: projectDraft?.fields.first_name ?? "", last_name: projectDraft?.fields.last_name ?? "", phone: projectDraft?.fields.phone ?? "", email: projectDraft?.fields.email ?? "", city: projectDraft?.fields.city ?? "", address: projectDraft?.fields.address ?? "", mode: "on_site", platform: "whatsapp", scheduled_at: "", description: projectDraft?.fields.description ?? "", notes: "" }));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => { const today = new Date(); return new Date(today.getFullYear(), today.getMonth(), 1); });
  const [appointmentTime, setAppointmentTime] = useState("09:00");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const setField = (name: keyof typeof fields, value: string) => setFields((current) => ({ ...current, [name]: value }));
  const calendarYear = calendarMonth.getFullYear();
  const calendarMonthIndex = calendarMonth.getMonth();
  const firstWeekday = (new Date(calendarYear, calendarMonthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();
  const monthLabel = new Intl.DateTimeFormat("fr-TN", { month: "long", year: "numeric" }).format(calendarMonth);
  const selectedDate = fields.scheduled_at.slice(0, 10);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const earliestMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const selectCalendarDate = (day: number) => { const date = new Date(calendarYear, calendarMonthIndex, day); const pad = (value: number) => String(value).padStart(2, "0"); setField("scheduled_at", `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${appointmentTime}`); setError(""); setIsCalendarOpen(false); };
  const selectAppointmentTime = (time: string) => { setAppointmentTime(time); if (selectedDate) setField("scheduled_at", `${selectedDate}T${time}`); };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSending(true); setError(""); setMessage("");
    try {
      let linkedRequestId = quoteRequestId ? Number(quoteRequestId) : null;
      if (projectDraft) {
        const quoteData = new FormData();
        Object.entries(projectDraft.fields).forEach(([name, value]) => { if (value) quoteData.append(name, value); });
        quoteData.set("first_name", fields.first_name); quoteData.set("last_name", fields.last_name); quoteData.set("phone", fields.phone); quoteData.set("email", fields.email); quoteData.set("description", fields.description);
        if (fields.city) quoteData.set("city", fields.city); if (fields.address) quoteData.set("address", fields.address);
        projectDraft.photos.forEach((photo) => quoteData.append("photos[]", photo));
        const quoteResponse = await fetch(`${apiUrl}/quote-requests`, { method: "POST", headers: { Accept: "application/json" }, body: quoteData });
        if (!quoteResponse.ok) throw new Error(await readApiError(quoteResponse, "Impossible d’enregistrer votre projet."));
        const quoteResult = await quoteResponse.json(); linkedRequestId = quoteResult.data.id;
      }
      const response = await fetch(`${apiUrl}/appointments`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ quote_request_id: linkedRequestId, first_name: fields.first_name, last_name: fields.last_name, phone: fields.phone, email: fields.email, city: fields.mode === "on_site" ? fields.city : null, address: fields.mode === "on_site" ? fields.address : null, appointment_type: "visit", appointment_mode: fields.mode, remote_platform: fields.mode === "remote" ? fields.platform : null, scheduled_at: fields.scheduled_at, notes: fields.notes || fields.description }) });
      if (!response.ok) throw new Error(await readApiError(response, "Impossible d’envoyer la demande de rendez-vous."));
      setMessage("Votre demande de rendez-vous est envoyée."); setIsSuccessOpen(true);
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Impossible d’envoyer la demande de rendez-vous."); } finally { setSending(false); }
  };

  return <Page variant="bwd-appointment-page" title="Demander un rendez-vous" subtitle={isFromEstimate ? "Choisissez votre créneau après votre estimation. Notre équipe le confirmera ensuite." : "Choisissez votre créneau pour une première consultation avec notre équipe."}>
    <div className="bwd-form-layout"><div className="bwd-note"><strong>Visite sur place :</strong> payante, tarif confirmé par l’entreprise.<br /><br /><strong>WhatsApp ou Zoom :</strong> échange à distance gratuit.<br /><br />{isFromEstimate ? "Le devis final sera préparé après le rendez-vous." : "Vous pouvez demander une estimation de devis avant ou après cette première consultation."}</div>
      <form className="bwd-form" onSubmit={submit}>
        <section className="bwd-appointment-card"><h2 className="bwd-appointment-step"><span>1</span> Vos coordonnées</h2><div className="bwd-appointment-fields"><label>Prénom *<input value={fields.first_name} onChange={(event) => setField("first_name", event.target.value)} required /></label><label>Nom *<input value={fields.last_name} onChange={(event) => setField("last_name", event.target.value)} required /></label><label>Téléphone *<input value={fields.phone} onChange={(event) => setField("phone", event.target.value)} required /></label><label>E-mail *<input type="email" value={fields.email} onChange={(event) => setField("email", event.target.value)} required /></label></div></section>
        <section className="bwd-appointment-card"><h2 className="bwd-appointment-step"><span>2</span> Votre rendez-vous</h2><div className="bwd-appointment-fields"><label>Type de rendez-vous<select value={fields.mode} onChange={(event) => setField("mode", event.target.value)}><option value="on_site">Visite sur place — payante</option><option value="remote">À distance — gratuit</option></select></label>{fields.mode === "remote" ? <label>Plateforme<select value={fields.platform} onChange={(event) => setField("platform", event.target.value)}><option value="whatsapp">WhatsApp — gratuit</option><option value="zoom">Zoom — gratuit</option></select></label> : <label>Ville *<input value={fields.city} onChange={(event) => setField("city", event.target.value)} required /></label>}{fields.mode === "on_site" && <label className="bwd-appointment-full">Adresse de la visite (facultative)<input value={fields.address} onChange={(event) => setField("address", event.target.value)} /></label>}</div></section>
        <section className="bwd-appointment-card"><h2 className="bwd-appointment-step"><span>3</span> Date et projet</h2><div className="bwd-appointment-when"><section className="bwd-simple-calendar" aria-label="Choisir une date de rendez-vous"><button type="button" className="bwd-calendar-toggle" aria-expanded={isCalendarOpen} onClick={() => setIsCalendarOpen((open) => !open)}><span><strong>Choisissez une date *</strong><small>{selectedDate ? `Date choisie : ${new Intl.DateTimeFormat("fr-TN", { dateStyle: "long" }).format(new Date(`${selectedDate}T12:00:00`))} à ${appointmentTime}` : "Cliquez ici pour ouvrir le calendrier"}</small></span><b>{isCalendarOpen ? "Fermer ↑" : "Ouvrir le calendrier ↓"}</b></button>{isCalendarOpen && <div className="bwd-calendar-content"><div className="bwd-simple-calendar-head"><strong>{monthLabel}</strong><div><button type="button" aria-label="Mois précédent" disabled={calendarMonth <= earliestMonth} onClick={() => setCalendarMonth(new Date(calendarYear, calendarMonthIndex - 1, 1))}>←</button><button type="button" aria-label="Mois suivant" onClick={() => setCalendarMonth(new Date(calendarYear, calendarMonthIndex + 1, 1))}>→</button></div></div><div className="bwd-simple-calendar-weekdays">{["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => <span key={day}>{day}</span>)}</div><div className="bwd-simple-calendar-days">{Array.from({ length: firstWeekday }).map((_, index) => <span key={`empty-${index}`} />)}{Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => { const date = new Date(calendarYear, calendarMonthIndex, day); const isoDate = `${calendarYear}-${String(calendarMonthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; return <button key={day} type="button" disabled={date < today} className={selectedDate === isoDate ? "selected" : ""} onClick={() => selectCalendarDate(day)}>{day}</button>; })}</div><label className="bwd-simple-calendar-time">Heure souhaitée *<input type="time" min="09:00" max="18:00" step="1800" value={appointmentTime} onChange={(event) => selectAppointmentTime(event.target.value)} required /></label></div>}</section><label className="bwd-appointment-description">Description du projet *<textarea rows={4} value={fields.description} onChange={(event) => setField("description", event.target.value)} placeholder="Expliquez brièvement votre projet et vos besoins…" required /><small>Décrivez la pièce, vos idées ou vos contraintes.</small></label></div></section>
        {error && <p className="bwd-form-error">{error}</p>}{message && <p className="bwd-form-success">{message}</p>}<div className="bwd-appointment-actions"><p><span>*</span> Champs obligatoires</p><button className="bwd-dark-button" disabled={sending}>{sending ? "Envoi…" : "Demander ce rendez-vous"}</button></div>
      </form>
    </div>{isSuccessOpen && <div className="bwd-success-modal-backdrop" role="presentation"><section className="bwd-success-modal" role="dialog" aria-modal="true" aria-labelledby="appointment-success-title"><span className="bwd-success-modal-icon">✓</span><p>Demande envoyée</p><h2 id="appointment-success-title">Votre rendez-vous est bien enregistré.</h2><div>Notre équipe vérifiera le créneau et vous contactera pour le confirmer.</div><small>Vous pouvez maintenant retourner à l’accueil.</small><button type="button" className="bwd-dark-button" onClick={() => navigate("/")}>Retourner à l’accueil</button></section></div>}
  </Page>;
}
