import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { ResolveIncidentDto } from './dto/resolve-incident.dto';
import { IncidentsService } from './incidents.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @Roles('passenger', 'driver')
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateIncidentDto) {
    return this.incidentsService.create(user.sub, dto);
  }

  @Get('my')
  @Roles('passenger', 'driver')
  myIncidents(@CurrentUser() user: { sub: string }) {
    return this.incidentsService.myIncidents(user.sub);
  }

  @Get('admin/all')
  @Roles('admin')
  adminList() {
    return this.incidentsService.adminList();
  }

  @Patch('admin/:id/resolve')
  @Roles('admin')
  resolve(@CurrentUser() user: { sub: string }, @Param('id') incidentId: string, @Body() dto: ResolveIncidentDto) {
    return this.incidentsService.resolve(user.sub, incidentId, dto);
  }
}
