import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File) {
    return {
      message: 'File uploaded successfully',
      filename: file.filename,
      fileUrl: `http://localhost:4001/uploads/${file.filename}`,
    };
  }

  async deleteFile(filename: string) {
    const filePath = path.join(this.uploadDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    fs.unlinkSync(filePath);
    return { message: 'File deleted successfully' };
  }
}
