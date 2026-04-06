import { IsDateString, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateTripDto {
  @IsUUID()
  routeId!: string;

  @IsDateString()
  tripDate!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  boardingReference!: string;
}
