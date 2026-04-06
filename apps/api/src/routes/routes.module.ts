import { Module } from '@nestjs/common';
import { FarePolicyModule } from '../fare-policy/fare-policy.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { AdminRoutesController } from './admin-routes.controller';
import { RoutesController } from './routes.controller';
import { BaseRoutesSyncService } from './base-routes-sync.service';
import { RoutesService } from './routes.service';

@Module({
  imports: [VehiclesModule, FarePolicyModule],
  controllers: [RoutesController, AdminRoutesController],
  providers: [RoutesService, BaseRoutesSyncService]
})
export class RoutesModule {}
