import { AppointmentDetail } from "./AppointmentDetail";

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

type AppointmentModalProps = {
  appointment: AdminAppointment;
  date: (value: string | null) => string;
  onClose: () => void;
  onUpdate: (status: string) => void;
  onCreateQuote?: () => void;
  busy: boolean;
};

export function AppointmentModal({
  appointment,
  date,
  onClose,
  onUpdate,
  onCreateQuote,
  busy,
}: AppointmentModalProps) {
  return (
    <div className="bwd-appointment-modal" role="presentation" onMouseDown={onClose}>
      <div
        className="bwd-appointment-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Gestion du rendez-vous"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="bwd-modal-close" onClick={onClose} aria-label="Fermer">×</button>
        <AppointmentDetail
          appointment={appointment}
          date={date}
          busy={busy}
          onBack={onClose}
          onUpdate={onUpdate}
          onCreateQuote={onCreateQuote}
        />
      </div>
    </div>
  );
}
