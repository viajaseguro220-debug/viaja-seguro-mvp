import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ResolveIncidentDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reviewNotes?: string;
}
