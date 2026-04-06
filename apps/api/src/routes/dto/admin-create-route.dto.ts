import { Transform, Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ROUTE_LOCATION_OPTIONS, ROUTE_SERVICE_SCOPE_OPTIONS, RouteServiceScope } from '../route-location-options';

export class AdminCreateRouteDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(ROUTE_LOCATION_OPTIONS)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  origin!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(ROUTE_LOCATION_OPTIONS)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  destination!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(500)
  pricePerSeat!: number;

  @IsOptional()
  @IsIn(ROUTE_SERVICE_SCOPE_OPTIONS)
  serviceScope?: RouteServiceScope;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description?: string;
}

