import { Injectable, NotFoundException } from '@nestjs/common';
import { ReleaseRepository } from './repository/release.repository';
import { CreateReleaseDto } from './dto/create-release.dto';
import { ReleaseResponseDto } from './dto/release-response.dto';
import { UpdatesGateway } from '../../gateways/updates.gateway';

@Injectable()
export class VersionService {
  constructor(
    private readonly releaseRepository: ReleaseRepository,
    private readonly updatesGateway: UpdatesGateway,
  ) {}

  getLatestRelease(): ReleaseResponseDto {
    const latestRelease = this.releaseRepository.findLatest();
    if (!latestRelease) {
      throw new NotFoundException('No release data available');
    }

    return { ...latestRelease };
  }

  createRelease(releaseDto: CreateReleaseDto): ReleaseResponseDto {
    const savedRelease = this.releaseRepository.saveRelease(releaseDto);
    this.updatesGateway.broadcastUpdate({ ...savedRelease });
    return { ...savedRelease };
  }
}
