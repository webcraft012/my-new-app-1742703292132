import { Injectable } from '@nestjs/common';

export interface LogEntry {
  content: string;
  createdAt: Date;
  isRead: boolean;
}

@Injectable()
export class InMemoryLogsDB {
  private storage: Map<string, LogEntry[]>;

  constructor() {
    this.storage = new Map<string, LogEntry[]>();
  }

  addLog(key: string, content: string): void {
    const logs = this.storage.get(key) || [];
    logs.push({
      content,
      createdAt: new Date(),
      isRead: false,
    });
    this.storage.set(key, logs);
  }

  getLogs(key: string): LogEntry[] {
    return this.storage.get(key) || [];
  }

  markAllAsRead(key: string): void {
    const logs = this.storage.get(key) || [];
    if (logs.length > 0) {
      logs.forEach((log) => {
        log.isRead = true;
      });
      this.storage.set(key, logs);
    }
  }

  markAsRead(key: string, index: number): void {
    const logs = this.storage.get(key) || [];
    if (logs.length > index && index >= 0) {
      logs[index].isRead = true;
      this.storage.set(key, logs);
    }
  }

  getUnreadCount(key: string): number {
    const logs = this.storage.get(key) || [];
    return logs.filter((log) => !log.isRead).length;
  }

  getUnreadLogs(key: string, markAsRead: boolean = true): LogEntry[] {
    const logs = this.storage.get(key) || [];
    if (markAsRead) {
      this.storage.set(
        key,
        logs.map((log) => ({ ...log, isRead: true })),
      );
    }
    return logs.filter((log) => !log.isRead);
  }

  clearLogs(key: string): void {
    this.storage.set(key, []);
  }

  deleteKey(key: string): boolean {
    return this.storage.delete(key);
  }

  hasLogs(key: string): boolean {
    const logs = this.storage.get(key);
    return !!logs && logs.length > 0;
  }

  hasUnreadLogs(key: string): boolean {
    const logs = this.storage.get(key) || [];
    return logs.some((log) => !log.isRead);
  }

  getAllKeys(): string[] {
    return Array.from(this.storage.keys());
  }

  clear(): void {
    this.storage.clear();
  }

  keepLatestLogs(key: string, count: number = 3): void {
    const logs = this.storage.get(key) || [];
    if (logs.length > count) {
      // Keep only the latest 'count' logs since we only push to the end
      this.storage.set(key, logs.slice(logs.length - count));
    }
  }
}
