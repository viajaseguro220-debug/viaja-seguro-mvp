import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class BulkDeleteRoutesDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  routeIds!: string[];
}
