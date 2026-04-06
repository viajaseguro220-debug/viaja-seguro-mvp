import { Module } from '@nestjs/common';
import { DriverProfilesModule } from '../driver-profiles/driver-profiles.module';
import { PassengerProfilesModule } from '../passenger-profiles/passenger-profiles.module';
import { UsersModule } from '../users/users.module';
import { AdminVerificationsController } from './admin-verifications.controller';
import { UserDocumentsController } from './user-documents.controller';
import { UserDocumentsService } from './user-documents.service';

@Module({
  imports: [UsersModule, DriverProfilesModule, PassengerProfilesModule],
  controllers: [UserDocumentsController, AdminVerificationsController],
  providers: [UserDocumentsService],
  exports: [UserDocumentsService]
})
export class UserDocumentsModule {}
