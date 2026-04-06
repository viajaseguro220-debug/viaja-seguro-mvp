import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { CreateUserDocumentDto } from './dto/create-user-document.dto';
import { UserDocumentsService } from './user-documents.service';

const uploadDirectory = join(process.cwd(), 'uploads', 'user-documents');
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.pdf']);

function ensureUploadDirectory() {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('passenger', 'driver')
@Controller('user-documents')
export class UserDocumentsController {
  constructor(private readonly userDocumentsService: UserDocumentsService) {}

  @Post()
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
  async create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateUserDocumentDto,
    @UploadedFile() file: any,
    @Req() req: any
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }

    if (!file) {
      throw new BadRequestException('Debes adjuntar un archivo de evidencia');
    }

    return this.userDocumentsService.createForUser(user.sub, dto, file);
  }

  @Get('my-documents')
  findMyDocuments(@CurrentUser() user: { sub: string }) {
    return this.userDocumentsService.findMyDocuments(user.sub);
  }
}
