import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async updateVerificationStatus(userId: string, status: 'pending' | 'approved' | 'rejected') {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: status
      }
    });
  }

  async getCurrentUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        driverProfile: true,
        passengerProfile: true
      }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      role: this.mapRole(user.role),
      verificationStatus: this.mapStatus(user.verificationStatus),
      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone,
      driverProfile: user.driverProfile
        ? {
            id: user.driverProfile.id,
            status: this.mapStatus(user.driverProfile.status),
            bankAccountNumber: user.driverProfile.bankAccountNumber,
            bankClabe: user.driverProfile.bankClabe
          }
        : null,
      passengerProfile: user.passengerProfile
        ? {
            id: user.passengerProfile.id,
            status: this.mapStatus(user.passengerProfile.status)
          }
        : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  validateRole(userRole: string, requiredRole: 'passenger' | 'driver' | 'admin') {
    if (this.mapRole(userRole) !== requiredRole) {
      throw new ForbiddenException('No tienes permisos para este recurso');
    }
  }

  mapRole(role: string): 'passenger' | 'driver' | 'admin' {
    if (role.toLowerCase() === 'driver') return 'driver';
    if (role.toLowerCase() === 'admin') return 'admin';
    return 'passenger';
  }

  mapStatus(status: string): 'pending' | 'approved' | 'rejected' {
    const normalized = status.toLowerCase();
    if (normalized === 'approved') return 'approved';
    if (normalized === 'rejected') return 'rejected';
    return 'pending';
  }
}

