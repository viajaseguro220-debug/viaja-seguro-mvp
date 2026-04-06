import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminCreateRouteDto } from './dto/admin-create-route.dto';
import { BulkDeleteRoutesDto } from './dto/bulk-delete-routes.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { RoutesService } from './routes.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/routes')
export class AdminRoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get('drivers')
  findAssignableDrivers() {
    return this.routesService.findAssignableDriversForAdmin();
  }

  @Get()
  findAll() {
    return this.routesService.findAllForAdmin();
  }

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: AdminCreateRouteDto) {
    return this.routesService.createForAdminOrDriver(user.id, dto);
  }

  @Post('bulk-delete')
  bulkDelete(@Body() dto: BulkDeleteRoutesDto) {
    return this.routesService.deleteManyForAdmin(dto.routeIds);
  }

  @Get(':id')
  findById(@Param('id') routeId: string) {
    return this.routesService.findByIdForAdmin(routeId);
  }

  @Patch(':id')
  update(@Param('id') _routeId: string, @Body() _dto: UpdateRouteDto) {
    throw new ForbiddenException('En esta fase la ruta base solo se crea por admin y no se edita para evitar inconsistencias.');
  }

  @Patch(':id/pause')
  pause(@Param('id') _routeId: string) {
    throw new ForbiddenException('En esta fase la pausa de rutas base esta deshabilitada.');
  }

  @Patch(':id/activate')
  activate(@Param('id') _routeId: string) {
    throw new ForbiddenException('En esta fase la activacion manual esta deshabilitada.');
  }

  @Delete(':id')
  remove(@Param('id') routeId: string) {
    return this.routesService.deleteForAdmin(routeId);
  }
}

