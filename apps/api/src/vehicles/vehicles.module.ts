import { Module } from '@nestjs/common';
import { UserDocumentsModule } from '../user-documents/user-documents.module';
import { AdminVehiclesController } from './admin-vehicles.controller';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
  imports: [UserDocumentsModule],
  controllers: [VehiclesController, AdminVehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService]
})
export class VehiclesModule {}
