import { Module } from '@nestjs/common';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { RouteOffersController } from './route-offers.controller';
import { RouteOffersService } from './route-offers.service';

@Module({
  imports: [VehiclesModule],
  controllers: [RouteOffersController],
  providers: [RouteOffersService],
  exports: [RouteOffersService]
})
export class RouteOffersModule {}
