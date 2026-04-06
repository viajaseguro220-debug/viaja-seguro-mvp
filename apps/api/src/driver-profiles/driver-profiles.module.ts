import { Module } from '@nestjs/common';
import { DriverProfilesService } from './driver-profiles.service';

@Module({
  providers: [DriverProfilesService],
  exports: [DriverProfilesService]
})
export class DriverProfilesModule {}
