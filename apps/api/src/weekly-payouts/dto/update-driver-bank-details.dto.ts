import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdateDriverBankDetailsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10,20}$/, { message: 'accountNumber debe tener entre 10 y 20 digitos numericos' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  accountNumber!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{18}$/, { message: 'clabe debe tener exactamente 18 digitos numericos' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  clabe!: string;
}
