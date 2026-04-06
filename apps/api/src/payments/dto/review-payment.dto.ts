import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ReviewPaymentDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reviewNotes?: string;
}
