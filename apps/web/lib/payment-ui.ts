import { APP_COMPANY_NAME } from '@/lib/app-config';

export function getPaymentFlowMessage(status?: string) {
  switch (status) {
    case 'submitted':
      return 'Comprobante enviado. El admin debe validar tu pago para habilitar el codigo de abordaje.';
    case 'approved':
      return 'Pago validado. Ya puedes usar tu codigo de abordaje.';
    case 'rejected':
      return 'Comprobante rechazado. Reenvia uno nuevo para habilitar el codigo de abordaje.';
    default:
      return 'Pago pendiente. Sigue las instrucciones y sube tu comprobante.';
  }
}

export const PAYMENT_RETENTION_NOTICE =
  `Retenemos el pago de forma temporal para proteger tu reserva. Si el conductor cancela, el admin puede reembolsarte o reasignarte a otro conductor disponible en ${APP_COMPANY_NAME}.`;
