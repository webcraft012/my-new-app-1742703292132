import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EditorService } from './editor.service';
import { CreateEditorDto, EditorDto, UpdateEditorDto } from './dtos/editor.dto';

@Controller('editors')
export class EditorController {
  constructor(private service: EditorService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() editor: CreateEditorDto) {
    return this.service.create(editor);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() editor: UpdateEditorDto) {
    return this.service.update(id, editor);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
