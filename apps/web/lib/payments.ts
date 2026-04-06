export type PaymentStatus = 'pending' | 'submitted' | 'approved' | 'rejected' | 'refunded';

export interface PaymentRouteSummary {
  id: string;
  publicId?: number | null;
  title: string | null;
  origin: string;
  destination: string;
}

export interface PaymentTripSummary {
  id: string;
  publicId?: number | null;
  tripDate: string;
  departureTimeSnapshot: string;
  route: PaymentRouteSummary | null;
}

export interface PaymentReservationSummary {
  id: string;
  publicId?: number | null;
  status: string;
  totalAmount: number;
  totalSeats: number;
  passenger?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  trip: PaymentTripSummary | null;
}

export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  status: PaymentStatus;
  provider: string;
  providerReference: string | null;
  paymentMethodLabel: string | null;
  paymentBeneficiary: string | null;
  paymentReference: string | null;
  paymentBusinessAccount: string | null;
  paymentProcessorLabel: string | null;
  paymentProcessingMessage: string | null;
  paymentInstructions: string | null;
  proofFileName: string | null;
  proofFilePath: string | null;
  proofFileUrl: string | null;
  reviewedByAdminUserId: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  appCommissionAmount: number;
  driverNetAmount: number;
  createdAt: string;
  updatedAt: string;
  reservation: PaymentReservationSummary | null;
  reviewedByAdmin?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
}