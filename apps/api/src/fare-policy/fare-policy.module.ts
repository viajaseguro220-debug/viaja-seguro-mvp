import { Module } from '@nestjs/common';
import { FarePolicyController } from './fare-policy.controller';
import { FarePolicyService } from './fare-policy.service';

@Module({
  controllers: [FarePolicyController],
  providers: [FarePolicyService],
  exports: [FarePolicyService]
})
export class FarePolicyModule {}