import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from './types/application.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private service: ApplicationService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get()
  async findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.service.findByUserId(userId);
    }
    return this.service.findAll();
  }

  @Get('/new/test')
  async test() {
    const userId = 'test-123';
    const appName = 'My new App';

    console.log('Generating application...');

    return this.service.generate({
      name: appName,
      userId,
      sandboxProvider: 'aws',
    });
  }

  @Post()
  async create(@Body() application: CreateApplicationDto) {
    return this.service.create(application);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() application: UpdateApplicationDto,
  ) {
    return this.service.update(id, application);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
