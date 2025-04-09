import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from 'nestjs-cloudinary';

@ApiTags('Upload-Image')
@Controller('upload-image')
export class UploadsController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @ApiOperation({ summary: 'Upload a files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.file) {
    try {
      const { url } = await this.cloudinary.uploadFile(file);
      return { url };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
