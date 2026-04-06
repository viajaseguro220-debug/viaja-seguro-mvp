import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminCreateRouteDto } from './dto/admin-create-route.dto';
import { CalculateDistanceDto } from './dto/calculate-distance.dto';
import { NearbyRoutesQueryDto } from './dto/nearby-routes-query.dto';
import { TakeViajeDto } from './dto/take-viaje.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RoutesService } from './routes.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @Roles('admin', 'driver')
  create(@CurrentUser() user: { id?: string; sub?: string }, @Body() dto: AdminCreateRouteDto) {
    const userId = user.id ?? user.sub;
    if (!userId) {
      throw new ForbiddenException('No se pudo identificar al usuario autenticado.');
    }
    return this.routesService.createForAdminOrDriver(userId, dto);
  }

  @Post('public')
  @Roles('admin', 'driver')
  createPublic(@CurrentUser() user: { id?: string; sub?: string }, @Body() dto: AdminCreateRouteDto) {
    const userId = user.id ?? user.sub;
    if (!userId) {
      throw new ForbiddenException('No se pudo identificar al usuario autenticado.');
    }
    return this.routesService.createForAdminOrDriver(userId, dto);
  }

  @Get('public')
  @Roles('passenger', 'driver', 'admin')
  findPublicRoutes() {
    return this.routesService.findPublicRoutes();
  }

  @Get('nearby')
  @Roles('passenger', 'driver', 'admin')
  findNearbyRoutes(@Query() query: NearbyRoutesQueryDto) {
    return this.routesService.findNearbyRoutes(query);
  }

  @Post('calculate-distance')
  @Roles('passenger', 'driver', 'admin')
  calculateDistance(@Body() dto: CalculateDistanceDto) {
    return this.routesService.calculateDistanceFromAddresses(dto.origin, dto.destination);
  }

  @Get('my-routes')
  @Roles('driver')
  findMyRoutes(@CurrentUser() user: { sub: string }) {
    return this.routesService.findMyRoutes(user.sub);
  }

  @Post(':id/take-viaje')
  @Roles('driver')
  takeViaje(@CurrentUser() user: { sub: string }, @Param('id') routeId: string, @Body() dto: TakeViajeDto) {
    return this.routesService.takeViaje(user.sub, routeId, dto);
  }

  @Get(':id')
  @Roles('driver')
  findById(@CurrentUser() user: { sub: string }, @Param('id') routeId: string) {
    return this.routesService.findById(user.sub, routeId);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') _routeId: string, @Body() _dto: UpdateRouteDto) {
    throw new ForbiddenException('En esta fase las rutas base se crean por admin o conductor, pero no se editan para mantener consistencia.');
  }

  @Patch(':id/pause')
  @Roles('admin')
  pause(@Param('id') _routeId: string) {
    throw new ForbiddenException('En esta fase la pausa manual de rutas base esta deshabilitada.');
  }

  @Patch(':id/activate')
  @Roles('admin')
  activate(@Param('id') _routeId: string) {
    throw new ForbiddenException('En esta fase la activacion manual de rutas base esta deshabilitada.');
  }
}



