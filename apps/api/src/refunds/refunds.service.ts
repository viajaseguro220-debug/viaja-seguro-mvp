import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ManualRefundDto } from './dto/manual-refund.dto';

type RefundRecord = {
  id: string;
  paymentId: string;
  reservationId: string;
  amount: number;
  reason: string | null;
  status: string;
  adminUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
  payment?: any;
  reservation?: any;
  adminUser?: any;
};

const PAYMENT_STATUS = {
  PAID: 'approved',
  REFUNDED: 'refunded'
} as const;

const RESERVATION_STATUS = {
  REFUNDED: 'refunded'
} as const;

@Injectable()
export class RefundsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const refunds = (await this.refundDelegate().findMany({
      include: {
        payment: true,
        reservation: {
          include: {
            trip: {
              include: {
                route: true
              }
            }
          }
        },
        adminUser: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: [{ createdAt: 'desc' }]
    })) as RefundRecord[];

    return refunds.map((refund) => this.mapRefund(refund));
  }

  async findById(refundId: string) {
    const refund = await this.findRefundOrThrow(refundId);
    return this.mapRefund(refund);
  }

  async manualRefund(adminUserId: string, paymentId: string, dto: ManualRefundDto) {
    const payment = await this.findPaymentForRefundOrThrow(paymentId);

    if (payment.status !== PAYMENT_STATUS.PAID) {
      throw new ForbiddenException('Solo payment en estado approved puede recibir refund manual');
    }

    if (payment.refund) {
      throw new ForbiddenException('Este payment ya tiene un refund registrado');
    }

    const refundAmount = this.roundCurrency(dto.amount ?? payment.amount);

    if (refundAmount <= 0 || refundAmount > payment.amount) {
      throw new ForbiddenException('Monto de refund invalido para el payment seleccionado');
    }

    const created = await this.prisma.$transaction(async (tx) => {
      const createdRefund = await (tx as any).refund.create({
        data: {
          paymentId: payment.id,
          reservationId: payment.reservationId,
          amount: refundAmount,
          reason: dto.reason ?? null,
          status: 'processed',
          adminUserId
        }
      });

      await (tx as any).payment.update({
        where: { id: payment.id },
        data: {
          status: PAYMENT_STATUS.REFUNDED
        }
      });

      await (tx as any).reservation.update({
        where: { id: payment.reservationId },
        data: {
          status: RESERVATION_STATUS.REFUNDED
        }
      });

      return createdRefund;
    });

    return this.findById(created.id);
  }

  private async findRefundOrThrow(refundId: string) {
    const refund = (await this.refundDelegate().findUnique({
      where: { id: refundId },
      include: {
        payment: true,
        reservation: {
          include: {
            trip: {
              include: {
                route: true
              }
            }
          }
        },
        adminUser: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    })) as RefundRecord | null;

    if (!refund) {
      throw new NotFoundException('Refund no encontrado');
    }

    return refund;
  }

  private async findPaymentForRefundOrThrow(paymentId: string) {
    const payment = await this.paymentDelegate().findUnique({
      where: { id: paymentId },
      include: {
        reservation: true,
        refund: true
      }
    });

    if (!payment) {
      throw new NotFoundException('Payment no encontrado');
    }

    return payment;
  }

  private roundCurrency(value: number) {
    return Math.round(value * 100) / 100;
  }

  private paymentDelegate() {
    return (this.prisma as unknown as { payment: any }).payment;
  }

  private refundDelegate() {
    return (this.prisma as unknown as { refund: any }).refund;
  }

  private mapRefund(refund: RefundRecord) {
    return {
      id: refund.id,
      paymentId: refund.paymentId,
      reservationId: refund.reservationId,
      amount: refund.amount,
      reason: refund.reason,
      status: refund.status,
      adminUserId: refund.adminUserId,
      createdAt: refund.createdAt,
      updatedAt: refund.updatedAt,
      payment: refund.payment
        ? {
            id: refund.payment.id,
            amount: refund.payment.amount,
            status: refund.payment.status,
            provider: refund.payment.provider,
            appCommissionAmount: refund.payment.appCommissionAmount,
            driverNetAmount: refund.payment.driverNetAmount
          }
        : null,
      reservation: refund.reservation
        ? {
            id: refund.reservation.id,
            publicId: refund.reservation.publicId ?? null,
            status: refund.reservation.status,
            trip: refund.reservation.trip
              ? {
                  id: refund.reservation.trip.id,
                  publicId: refund.reservation.trip.publicId ?? null,
                  tripDate: refund.reservation.trip.tripDate,
                  route: refund.reservation.trip.route
                    ? {
                        id: refund.reservation.trip.route.id,
                        publicId: refund.reservation.trip.route.publicId ?? null,
                        title: refund.reservation.trip.route.title,
                        origin: refund.reservation.trip.route.origin,
                        destination: refund.reservation.trip.route.destination
                      }
                    : null
                }
              : null
          }
        : null,
      adminUser: refund.adminUser ?? null
    };
  }
}
