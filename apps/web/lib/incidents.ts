export type IncidentType = 'comment' | 'report' | 'alert';

export interface Incident {
  id: string;
  type: IncidentType;
  title: string;
  message: string;
  status: 'open' | 'resolved';
  routeId: string | null;
  routeOfferId: string | null;
  tripId: string | null;
  reservationId: string | null;
  reviewNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  reporter: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  reviewedBy?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  } | null;
}

export interface CreateIncidentPayload {
  type: IncidentType;
  title: string;
  message: string;
  routeId?: string;
  routeOfferId?: string;
  tripId?: string;
  reservationId?: string;
}
