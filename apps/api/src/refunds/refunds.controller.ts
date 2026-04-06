import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ManualRefundDto } from './dto/manual-refund.dto';
import { RefundsService } from './refunds.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Get()
  findAll() {
    return this.refundsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') refundId: string) {
    return this.refundsService.findById(refundId);
  }

  @Post(':paymentId/manual-refund')
  manualRefund(
    @CurrentUser() user: { sub: string },
    @Param('paymentId') paymentId: string,
    @Body() dto: ManualRefundDto
  ) {
    return this.refundsService.manualRefund(user.sub, paymentId, dto);
  }
}
