import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ReviewVerificationDto } from './dto/review-verification.dto';
import { UserDocumentsService } from './user-documents.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/verifications')
export class AdminVerificationsController {
  constructor(private readonly userDocumentsService: UserDocumentsService) {}

  @Get('pending')
  findPending() {
    return this.userDocumentsService.findPendingVerifications();
  }

  @Get(':userId')
  findByUserId(@Param('userId') userId: string) {
    return this.userDocumentsService.findVerificationByUserId(userId);
  }

  @Patch(':userId/approve')
  approve(@Param('userId') userId: string, @Body() dto: ReviewVerificationDto) {
    return this.userDocumentsService.approveVerification(userId, dto);
  }

  @Patch(':userId/reject')
  reject(@Param('userId') userId: string, @Body() dto: ReviewVerificationDto) {
    return this.userDocumentsService.rejectVerification(userId, dto);
  }
}
