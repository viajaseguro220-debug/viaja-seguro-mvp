import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SimulatePaymentDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  providerReference?: string;
}
