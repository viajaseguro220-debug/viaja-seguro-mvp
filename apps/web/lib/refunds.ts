export interface Refund {
  id: string;
  paymentId: string;
  reservationId: string;
  amount: number;
  reason: string | null;
  status: string;
  adminUserId: string | null;
  createdAt: string;
  updatedAt: string;
  payment: {
    id: string;
    amount: number;
    status: string;
    provider: string;
    appCommissionAmount: number;
    driverNetAmount: number;
  } | null;
  reservation: {
    id: string;
    publicId?: number | null;
    status: string;
    trip: {
      id: string;
      publicId?: number | null;
      tripDate: string;
      route: {
        id: string;
        publicId?: number | null;
        title: string | null;
        origin: string;
        destination: string;
      } | null;
    } | null;
  } | null;
  adminUser: {
    id: string;
    fullName: string;
    email: string;
  } | null;
}

export interface ManualRefundPayload {
  amount?: number;
  reason?: string;
}
