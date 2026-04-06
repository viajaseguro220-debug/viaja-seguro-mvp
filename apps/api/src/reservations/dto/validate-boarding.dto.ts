import { IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MaxLength } from 'class-validator';

export class ValidateBoardingDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, {
    message: 'numericCode debe contener solo digitos'
  })
  @MaxLength(6, { message: 'numericCode debe tener maximo 6 digitos' })
  numericCode?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  qrToken?: string;

  @IsOptional()
  @IsUUID()
  tripId?: string;
}
