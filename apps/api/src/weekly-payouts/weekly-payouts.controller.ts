import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GenerateWeeklyPayoutDto } from './dto/generate-weekly-payout.dto';
import { MarkWeeklyPayoutPaidDto } from './dto/mark-weekly-payout-paid.dto';
import { WeeklyPayoutsService } from './weekly-payouts.service';
import { UpdateDriverBankDetailsDto } from './dto/update-driver-bank-details.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('weekly-payouts')
export class WeeklyPayoutsController {
  constructor(private readonly weeklyPayoutsService: WeeklyPayoutsService) {}

  @Get()
  @Roles('admin')
  findAll() {
    return this.weeklyPayoutsService.findAllForAdmin();
  }

  @Get('my-payouts')
  @Roles('driver')
  myPayouts(@CurrentUser() user: { sub: string }) {
    return this.weeklyPayoutsService.myDriverPayouts(user.sub);
  }

  @Get('my-stats')
  @Roles('driver')
  myStats(
    @CurrentUser() user: { sub: string },
    @Query('periodStart') periodStart?: string,
    @Query('periodEnd') periodEnd?: string
  ) {
    return this.weeklyPayoutsService.getDriverStats(user.sub, periodStart, periodEnd);
  }

  @Get('my-bank-details')
  @Roles('driver')
  myBankDetails(@CurrentUser() user: { sub: string }) {
    return this.weeklyPayoutsService.getDriverBankDetails(user.sub);
  }

  @Patch('my-bank-details')
  @Roles('driver')
  updateMyBankDetails(@CurrentUser() user: { sub: string }, @Body() dto: UpdateDriverBankDetailsDto) {
    return this.weeklyPayoutsService.updateDriverBankDetails(user.sub, dto);
  }

  @Get('stats')
  @Roles('admin')
  stats(@Query('periodStart') periodStart?: string, @Query('periodEnd') periodEnd?: string) {
    return this.weeklyPayoutsService.getAdminStats(periodStart, periodEnd);
  }

  @Get(':id')
  @Roles('admin', 'driver')
  findById(@CurrentUser() user: { sub: string; role: string }, @Param('id') payoutId: string) {
    return this.weeklyPayoutsService.findByIdForAdminOrDriver(payoutId, user.sub, user.role);
  }

  @Post('generate')
  @Roles('admin')
  generate(@Body() dto: GenerateWeeklyPayoutDto) {
    return this.weeklyPayoutsService.generate(dto);
  }

  @Patch(':id/request-payment')
  @Roles('driver')
  requestPayment(@CurrentUser() user: { sub: string }, @Param('id') payoutId: string) {
    return this.weeklyPayoutsService.requestPayment(payoutId, user.sub);
  }

  @Patch(':id/mark-paid')
  @Roles('admin')
  markPaid(@Param('id') payoutId: string, @Body() dto: MarkWeeklyPayoutPaidDto) {
    return this.weeklyPayoutsService.markPaid(payoutId, dto);
  }
}



