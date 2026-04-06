import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { ResolveIncidentDto } from './dto/resolve-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(reporterUserId: string, dto: CreateIncidentDto) {
    await this.ensureReporterRole(reporterUserId);

    const incident = await this.prisma.incidentReport.create({
      data: {
        reporterUserId,
        type: dto.type,
        title: dto.title.trim(),
        message: dto.message.trim(),
        routeId: dto.routeId,
        routeOfferId: dto.routeOfferId,
        tripId: dto.tripId,
        reservationId: dto.reservationId,
        status: 'open'
      },
      include: this.includeConfig()
    });

    return this.mapIncident(incident);
  }

  async myIncidents(reporterUserId: string) {
    await this.ensureReporterRole(reporterUserId);

    const incidents = await this.prisma.incidentReport.findMany({
      where: { reporterUserId },
      include: this.includeConfig(),
      orderBy: [{ createdAt: 'desc' }]
    });

    return incidents.map((incident) => this.mapIncident(incident));
  }

  async adminList() {
    const incidents = await this.prisma.incidentReport.findMany({
      include: this.includeConfig(),
      orderBy: [{ createdAt: 'desc' }]
    });

    return incidents.map((incident) => this.mapIncident(incident));
  }

  async resolve(adminUserId: string, incidentId: string, dto: ResolveIncidentDto) {
    await this.ensureAdminRole(adminUserId);

    const existing = await this.prisma.incidentReport.findUnique({ where: { id: incidentId } });
    if (!existing) throw new NotFoundException('Incidencia no encontrada');

    const updated = await this.prisma.incidentReport.update({
      where: { id: incidentId },
      data: {
        status: 'resolved',
        reviewedById: adminUserId,
        reviewedAt: new Date(),
        reviewNotes: dto.reviewNotes?.trim() || null
      },
      include: this.includeConfig()
    });

    return this.mapIncident(updated);
  }

  private includeConfig() {
    return {
      reporter: { select: { id: true, fullName: true, email: true, role: true } },
      reviewedBy: { select: { id: true, fullName: true, email: true, role: true } }
    } as const;
  }

  private mapIncident(incident: any) {
    return {
      id: incident.id,
      type: incident.type,
      title: incident.title,
      message: incident.message,
      status: incident.status,
      routeId: incident.routeId,
      routeOfferId: incident.routeOfferId,
      tripId: incident.tripId,
      reservationId: incident.reservationId,
      reviewNotes: incident.reviewNotes,
      reviewedAt: incident.reviewedAt,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
      reporter: incident.reporter,
      reviewedBy: incident.reviewedBy
    };
  }

  private async ensureReporterRole(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const role = String(user.role || '').toLowerCase();
    if (role !== 'passenger' && role !== 'driver') {
      throw new ForbiddenException('Solo pasajero o conductor pueden registrar incidencias.');
    }
  }

  private async ensureAdminRole(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (String(user.role || '').toLowerCase() !== 'admin') {
      throw new ForbiddenException('Solo admin puede resolver incidencias.');
    }
  }
}
