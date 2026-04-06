import { Transform } from 'class-transformer';
import { IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';

function toNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().replace(',', '.');
    if (!normalized) return Number.NaN;
    return Number(normalized);
  }
  return Number.NaN;
}

export class AvailableTripsQueryDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @Transform(({ value }) => toNumber(value))
  @IsLatitude()
  lat?: number;

  @IsOptional()
  @Transform(({ value }) => toNumber(value))
  @IsLongitude()
  lng?: number;
}
