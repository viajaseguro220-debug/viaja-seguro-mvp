import { IsOptional, IsString, MaxLength } from 'class-validator';

export class MarkWeeklyPayoutPaidDto {
  @IsOptional()
  @IsString()
  @MaxLength(400)
  notes?: string;
}
