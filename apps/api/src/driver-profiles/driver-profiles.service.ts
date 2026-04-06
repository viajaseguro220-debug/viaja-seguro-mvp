import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DriverProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async createForUser(userId: string, status: 'pending' | 'approved' | 'rejected' = 'pending') {
    return this.prisma.driverProfile.create({
      data: {
        userId,
        status
      }
    });
  }

  async updateStatusForUser(userId: string, status: 'pending' | 'approved' | 'rejected') {
    return this.prisma.driverProfile.updateMany({
      where: { userId },
      data: { status }
    });
  }
}
