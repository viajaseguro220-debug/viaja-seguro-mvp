import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AvailableTripsQueryDto } from './dto/available-trips-query.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripsService } from './trips.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @Roles('driver')
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateTripDto) {
    return this.tripsService.create(user.sub, dto);
  }

  @Get('my-trips')
  @Roles('driver')
  findMyTrips(@CurrentUser() user: { sub: string }) {
    return this.tripsService.findMyTrips(user.sub);
  }

  @Get('admin/all')
  @Roles('admin')
  findAllForAdmin() {
    return this.tripsService.findAllForAdmin();
  }

  @Get('admin/:id')
  @Roles('admin')
  findByIdForAdmin(@Param('id') tripId: string) {
    return this.tripsService.findByIdForAdmin(tripId);
  }

  @Get('available')
  @Roles('passenger')
  findAvailable(@CurrentUser() user: { sub: string }, @Query() query: AvailableTripsQueryDto) {
    return this.tripsService.findAvailableForPassenger(user.sub, query);
  }

  @Get('available/:id')
  @Roles('passenger')
  findAvailableById(@CurrentUser() user: { sub: string }, @Param('id') tripId: string) {
    return this.tripsService.findAvailableByIdForPassenger(user.sub, tripId);
  }

  @Get(':id')
  @Roles('driver')
  findById(@CurrentUser() user: { sub: string }, @Param('id') tripId: string) {
    return this.tripsService.findById(user.sub, tripId);
  }

  @Patch(':id/start')
  @Roles('driver')
  start(@CurrentUser() user: { sub: string }, @Param('id') tripId: string) {
    return this.tripsService.start(user.sub, tripId);
  }

  @Patch(':id/finish')
  @Roles('driver')
  finish(@CurrentUser() user: { sub: string }, @Param('id') tripId: string) {
    return this.tripsService.finish(user.sub, tripId);
  }

  @Patch(':id/cancel')
  @Roles('driver')
  cancel(@CurrentUser() user: { sub: string }, @Param('id') tripId: string) {
    return this.tripsService.cancel(user.sub, tripId);
  }
}



