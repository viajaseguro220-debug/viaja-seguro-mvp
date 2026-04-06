import { Module } from '@nestjs/common';
import { PassengerProfilesService } from './passenger-profiles.service';

@Module({
  providers: [PassengerProfilesService],
  exports: [PassengerProfilesService]
})
export class PassengerProfilesModule {}
