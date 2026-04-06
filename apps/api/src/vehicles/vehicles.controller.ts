import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateVehicleDocumentDto } from './dto/create-vehicle-document.dto';
import { UpsertVehicleDto } from './dto/upsert-vehicle.dto';
import { VehiclesService } from './vehicles.service';

const uploadDirectory = join(process.cwd(), 'uploads', 'vehicle-documents');
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.pdf']);

function ensureUploadDirectory() {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('driver')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: UpsertVehicleDto) {
    return this.vehiclesService.create(user.sub, dto);
  }

  @Get('my-vehicle')
  myVehicle(@CurrentUser() user: { sub: string }) {
    return this.vehiclesService.myVehicle(user.sub);
  }

  @Patch('my-vehicle')
  update(@CurrentUser() user: { sub: string }, @Body() dto: UpsertVehicleDto) {
    return this.vehiclesService.update(user.sub, dto);
  }

  @Post('my-vehicle/documents')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req: any, _file: any, callback: (error: Error | null, destination: string) => void) => {
          ensureUploadDirectory();
          callback(null, uploadDirectory);
        },
        filename: (_req: any, file: any, callback: (error: Error | null, filename: string) => void) => {
          const extension = extname(file.originalname).toLowerCase();
          callback(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`);
        }
      }),
      limits: {
        fileSize: 5 * 1024 * 1024
      },
      fileFilter: (req: any, file: any, callback: (error: Error | null, acceptFile: boolean) => void) => {
        const extension = extname(file.originalname).toLowerCase();
        if (!allowedExtensions.has(extension)) {
          req.fileValidationError = 'Solo se permiten archivos JPG, JPEG, PNG o PDF';
          callback(null, false);
          return;
        }

        callback(null, true);
      }
    })
  )
  addDocument(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateVehicleDocumentDto,
    @UploadedFile() file: any,
    @Req() req: any
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }

    if (!file) {
      throw new BadRequestException('Debes adjuntar un archivo de evidencia');
    }

    return this.vehiclesService.addDocument(user.sub, dto, file);
  }
}
