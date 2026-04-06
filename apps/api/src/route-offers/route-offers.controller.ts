import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateRouteOfferDto } from './dto/create-route-offer.dto';
import { UpdateRouteOfferDto } from './dto/update-route-offer.dto';
import { RouteOffersService } from './route-offers.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('route-offers')
export class RouteOffersController {
  constructor(private readonly routeOffersService: RouteOffersService) {}

  @Get('routes')
  @Roles('driver', 'passenger', 'admin')
  listBaseRoutes() {
    return this.routeOffersService.listBaseRoutes();
  }

  @Post()
  @Roles('driver')
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateRouteOfferDto) {
    return this.routeOffersService.create(user.sub, dto);
  }

  @Get('my-offers')
  @Roles('driver')
  myOffers(@CurrentUser() user: { sub: string }) {
    return this.routeOffersService.myOffers(user.sub);
  }

  @Patch(':id')
  @Roles('driver')
  update(@CurrentUser() user: { sub: string }, @Param('id') offerId: string, @Body() dto: UpdateRouteOfferDto) {
    return this.routeOffersService.update(user.sub, offerId, dto);
  }

  @Get('route/:routeId')
  @Roles('driver', 'passenger', 'admin')
  listByRoute(@Param('routeId') routeId: string) {
    return this.routeOffersService.listByRoute(routeId);
  }
}
