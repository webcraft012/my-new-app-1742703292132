import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { applicationTable } from '../../database/schema';
import { IApplicationRepository } from '../types/application.repository';
import {
  ApplicationDto,
  CreateApplicationDto,
  UpdateApplicationDto,
} from '../types/application.dto';

@Injectable()
export class ApplicationRepository implements IApplicationRepository {
  constructor(@Inject('DatabaseClient') private client) {}

  async create(application: CreateApplicationDto): Promise<string> {
    const result = await this.client
      .insert(applicationTable)
      .values(application as any)
      .returning({ id: applicationTable.id });

    if (result.length > 0) {
      return result[0].id;
    }

    throw new Error('Failed to insert application');
  }

  async update(id: string, application: UpdateApplicationDto) {
    const existingApplication = await this.findOne(id);
    if (!existingApplication) {
      throw new Error('Application not found');
    }

    await this.client
      .update(applicationTable)
      .set(application)
      .where(eq(applicationTable.id, id));
  }

  async delete(id: string) {
    await this.client
      .delete(applicationTable)
      .where(eq(applicationTable.id, id));
  }

  async findOne(id: string): Promise<ApplicationDto | undefined> {
    const result = await this.client
      .select()
      .from(applicationTable)
      .where(eq(applicationTable.id, id));
    return result[0] ?? undefined;
  }

  async findAll(): Promise<ApplicationDto[]> {
    return this.client.select().from(applicationTable);
  }

  async findByUserId(userId: string): Promise<ApplicationDto[]> {
    return this.client
      .select()
      .from(applicationTable)
      .where(eq(applicationTable.userId, userId));
  }
}
