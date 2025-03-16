export interface ApplicationDto {
  id: string;
  name: string;
  repoUrl: string;
  sandboxId?: string;
  description?: string;
  userId: string;
  previewUrl?: string;
  sandboxProvider: string;
  metadata?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateApplicationDto {
  name: string;
  sandboxId?: string;
  description?: string;
  userId: string;
  repoUrl?: string;
  previewUrl?: string;
  sandboxProvider: string;
  metadata?: string;
}

export interface UpdateApplicationDto {
  name?: string;
  repoUrl?: string;
  sandboxId?: string;
  description?: string;
  userId?: string;
  previewUrl?: string;
  sandboxProvider?: string;
  metadata?: string;
}
