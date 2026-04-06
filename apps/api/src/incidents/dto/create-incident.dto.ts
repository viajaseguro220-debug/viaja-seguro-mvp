import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

const INCIDENT_TYPES = ['comment', 'report', 'alert'] as const;

export class CreateIncidentDto {
  @IsString()
  @IsIn(INCIDENT_TYPES)
  type!: (typeof INCIDENT_TYPES)[number];

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1500)
  message!: string;

  @IsOptional()
  @IsUUID('4')
  routeId?: string;

  @IsOptional()
  @IsUUID('4')
  routeOfferId?: string;

  @IsOptional()
  @IsUUID('4')
  tripId?: string;

  @IsOptional()
  @IsUUID('4')
  reservationId?: string;
}
