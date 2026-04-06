import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class ManualRefundDto {
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  reason?: string;
}
