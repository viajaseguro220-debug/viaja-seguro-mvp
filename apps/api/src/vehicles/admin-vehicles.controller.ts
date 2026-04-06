import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ReviewVehicleDto } from './dto/review-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/vehicles')
export class AdminVehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get('pending')
  findPending() {
    return this.vehiclesService.findPendingVehicles();
  }

  @Get(':vehicleId')
  findById(@Param('vehicleId') vehicleId: string) {
    return this.vehiclesService.findByIdForAdmin(vehicleId);
  }

  @Patch(':vehicleId/approve')
  approve(@Param('vehicleId') vehicleId: string, @Body() dto: ReviewVehicleDto) {
    return this.vehiclesService.approve(vehicleId, dto);
  }

  @Patch(':vehicleId/reject')
  reject(@Param('vehicleId') vehicleId: string, @Body() dto: ReviewVehicleDto) {
    return this.vehiclesService.reject(vehicleId, dto);
  }
}
