import { Module } from '@nestjs/common';
import { WeeklyPayoutsController } from './weekly-payouts.controller';
import { WeeklyPayoutsService } from './weekly-payouts.service';

@Module({
  controllers: [WeeklyPayoutsController],
  providers: [WeeklyPayoutsService]
})
export class WeeklyPayoutsModule {}
