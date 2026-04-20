import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DockerService } from '../services/DockerService.js';
import { DockerRepository } from '../repositories/DockerRepository.js';
import { CommandString } from '../types/index.js';

vi.mock('../repositories/DockerRepository.js');

describe('DockerService', () => {
  let service: DockerService;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = new DockerRepository();
    service = new DockerService(mockRepo);
    vi.clearAllMocks();
  });

  it('checkStatus returns isRunning: true if docker is installed and running', async () => {
    mockRepo.isInstalled.mockReturnValue(true);
    mockRepo.execute.mockReturnValue('20.10.7');

    const res = await service.checkStatus();
    expect(res).toEqual({ isRunning: true, version: '20.10.7' });
    expect(mockRepo.execute).toHaveBeenCalledWith('docker version --format "{{.Server.Version}}"' as CommandString);
  });

  it('checkStatus returns isRunning: false if docker is not installed', async () => {
    mockRepo.isInstalled.mockReturnValue(false);

    const res = await service.checkStatus();
    expect(res).toEqual({ isRunning: false });
  });

  it('prune calls execute with correct command', async () => {
    mockRepo.execute.mockReturnValue('pruned');
    const res = await service.prune();
    expect(res).toEqual({ output: 'pruned' });
    expect(mockRepo.execute).toHaveBeenCalledWith('docker system prune -af --volumes' as CommandString);
  });

  it('getLargeImages parses output correctly', async () => {
    const mockOutput = 'repo1|tag1|1GB\nrepo2|tag2|500MB';
    mockRepo.execute.mockReturnValue(mockOutput);

    const res = await service.getLargeImages();
    expect(res).toHaveLength(2);
    expect(res[0]).toEqual({ repository: 'repo1', tag: 'tag1', size: '1GB' });
    expect(res[1]).toEqual({ repository: 'repo2', tag: 'tag2', size: '500MB' });
  });
});
