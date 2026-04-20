import os from 'os';
import { logger } from '../utils/index.js';
import { ShellRepository } from '../repositories/index.js';
import { CommandString } from '../types/index.js';

export interface ServiceStatus {
  name: string;
  isRunning: boolean;
  port?: number;
}

export class ServiceService {
  constructor(private readonly shellRepo = new ShellRepository()) {}

  private readonly commonServices = [
    { name: 'PostgreSQL', port: 5432, check: 'pg_isready' },
    { name: 'Redis', port: 6379, check: 'redis-cli ping' },
    { name: 'MongoDB', port: 27017, check: 'mongosh --eval "db.adminCommand(\'ping\')"' },
    { name: 'Docker', port: 0, check: 'docker ps' },
    { name: 'Nginx', port: 80, check: 'curl -I http://localhost' }
  ];

  /**
   * Yaygın servislerin durumunu kontrol eder.
   */
  async checkServices(): Promise<ServiceStatus[]> {
    const results: ServiceStatus[] = [];

    for (const service of this.commonServices) {
      let isRunning = false;
      try {
        this.shellRepo.execute(service.check as CommandString);
        isRunning = true;
      } catch (error) {
        // Servis çalışmıyor veya check komutu yok
      }

      // Port bazlı ek kontrol (isteğe bağlı)
      if (!isRunning && service.port > 0) {
        isRunning = this.isPortOpen(service.port);
      }

      results.push({ name: service.name, isRunning, port: service.port });
    }

    return results;
  }

  private isPortOpen(port: number): boolean {
    try {
      const platform = os.platform();
      const cmd = platform === 'win32' 
        ? `netstat -an | findstr :${port}` 
        : `nc -z -w1 localhost ${port}`;
      
      this.shellRepo.execute(cmd as CommandString);
      return true;
    } catch {
      return false;
    }
  }
}
