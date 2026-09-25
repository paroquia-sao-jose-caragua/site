export type AppointmentServiceCategory =
  | 'clergy_sacramental'
  | 'home_visit'
  | 'pastoral';

export interface AppointmentService {
  id: string;
  title: string;
  category: AppointmentServiceCategory;
  description: string | null;
  defaultDurationMinutes: number;
  requiresAddress: boolean;
  active: boolean;
}

export interface PastoralAgent {
  id: string;
  name: string;
  title: string | null;
  actingRole: string;
  phone: string;
  email: string | null;
  communityId: string | null;
  photoId: string | null;
  photoUrl?: string | null;
  acceptsAppointments: boolean;
  active: boolean;
  community?: {
    id: string;
    name: string;
  } | null;
  services?: AppointmentService[];
}

export interface AvailableSlot {
  startTime: string; // "14:00"
  endTime: string; // "14:30"
  agentId: string;
  communityId: string | null;
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface PatientConditions {
  isBedridden?: boolean;
  canSwallowHost?: boolean;
  isLucid?: boolean;
  notes?: string;
}

export interface Appointment {
  id: string;
  agentId: string;
  serviceId: string;
  communityId: string | null;
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string | null;
  requesterRelationship: string | null;
  patientName: string | null;
  patientAddress: string | null;
  patientConditions: PatientConditions | null;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  accessToken: string;
  requesterNotes: string | null;
  privatePastoralNotes: string | null;
  cancellationReason: string | null;
  createdAt: string;

  service?: AppointmentService | null;
  agent?: PastoralAgent | null;
  community?: {
    id: string;
    name: string;
  } | null;
}

export interface CreateAppointmentInput {
  agentId: string;
  serviceId: string;
  communityId?: string | null;
  requesterName: string;
  requesterPhone: string;
  requesterEmail?: string | null;
  requesterRelationship?: string | null;
  patientName?: string | null;
  patientAddress?: string | null;
  patientConditions?: PatientConditions | null;
  appointmentDate: string;
  startTime: string;
  requesterNotes?: string | null;
}
