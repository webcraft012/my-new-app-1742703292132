import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { EditorService } from './editor.service';
import { EditorDto } from './dtos/editor.dto';

@Controller('editors')
export class EditorController {
  constructor(private service: EditorService) {}

  @Get(':id')
  async findOne(id: string) {
    return this.service.findOne(id);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() editor: EditorDto) {
    return this.service.create(editor);
  }

  @Patch(':id')
  async update(@Body() editor: EditorDto) {
    return this.service.update(editor);
  }
}
