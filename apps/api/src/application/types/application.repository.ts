import {
  ApplicationDto,
  CreateApplicationDto,
  UpdateApplicationDto,
} from './application.dto';

export interface IApplicationRepository {
  create(application: CreateApplicationDto): Promise<string>;
  update(id: string, application: UpdateApplicationDto): Promise<void>;
  delete(id: string): Promise<void>;
  findOne(id: string): Promise<ApplicationDto>;
  findAll(): Promise<ApplicationDto[]>;
  findByUserId(userId: string): Promise<ApplicationDto[]>;
}
