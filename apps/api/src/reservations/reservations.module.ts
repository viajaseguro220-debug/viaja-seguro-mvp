import { Module } from '@nestjs/common';
import { RouteOffersModule } from '../route-offers/route-offers.module';
import { UserDocumentsModule } from '../user-documents/user-documents.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [UserDocumentsModule, VehiclesModule, RouteOffersModule],
  controllers: [ReservationsController],
  providers: [ReservationsService]
})
export class ReservationsModule {}
