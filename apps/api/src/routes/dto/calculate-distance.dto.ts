import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CalculateDistanceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  origin!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  destination!: string;
}
