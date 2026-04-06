import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpsertFarePolicyDto } from './dto/upsert-fare-policy.dto';
import { FarePolicyService } from './fare-policy.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class FarePolicyController {
  constructor(private readonly farePolicyService: FarePolicyService) {}

  @Get('fare-policy/current')
  @Roles('driver', 'admin')
  getCurrentPolicy() {
    return this.farePolicyService.getCurrentPolicy();
  }

  @Get('admin/fare-policy/current')
  @Roles('admin')
  getCurrentPolicyForAdmin() {
    return this.farePolicyService.getCurrentPolicy();
  }

  @Get('admin/fare-policy/history')
  @Roles('admin')
  getHistory() {
    return this.farePolicyService.getHistory();
  }

  @Put('admin/fare-policy/current')
  @Roles('admin')
  updateCurrentPolicy(@CurrentUser() user: { sub: string }, @Body() dto: UpsertFarePolicyDto) {
    return this.farePolicyService.updateCurrentPolicy(user.sub, dto);
  }
}