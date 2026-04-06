import { Transform, Type } from 'class-transformer';
import { IsInt, IsLatitude, IsLongitude, IsNumber, IsOptional, Max, Min } from 'class-validator';

function toNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().replace(',', '.');
    if (!normalized) return Number.NaN;
    return Number(normalized);
  }
  return Number.NaN;
}

export class NearbyRoutesQueryDto {
  @Transform(({ value }) => toNumber(value))
  @IsLatitude()
  lat!: number;

  @Transform(({ value }) => toNumber(value))
  @IsLongitude()
  lng!: number;

  @IsOptional()
  @Transform(({ value }) => toNumber(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.1)
  @Max(100)
  radiusKm?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
