import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateReleaseDto } from '../dto/create-release.dto';
import { ReleaseEntity } from '../entities/release.entity';

@Injectable()
export class ReleaseRepository {
  private readonly logger = new Logger(ReleaseRepository.name);
  private readonly filePath: string;
  private releases: ReleaseEntity[] = [];

  constructor(private readonly configService: ConfigService) {
    const configuredPath = this.configService.get<string>('app.releaseDataPath');
    this.filePath = join(process.cwd(), configuredPath ?? './data/releases.json');
    this.ensureStorage();
    this.loadReleases();
  }

  findLatest(): ReleaseEntity | null {
    return this.releases.length ? this.releases[0] : null;
  }

  findAll(): ReleaseEntity[] {
    return [...this.releases];
  }

  saveRelease(releaseDto: CreateReleaseDto): ReleaseEntity {
    const newRelease: ReleaseEntity = { ...releaseDto };
    const existingIndex = this.releases.findIndex((item) => item.version === releaseDto.version);

    if (existingIndex >= 0) {
      this.releases[existingIndex] = newRelease;
    } else {
      this.releases.push(newRelease);
    }

    this.sortReleases();
    this.persist();
    this.logger.log(`Stored release ${newRelease.version} to ${this.filePath}`);
    return newRelease;
  }

  private ensureStorage(): void {
    const folder = join(this.filePath, '..');
    if (!existsSync(folder)) {
      throw new Error(`Release storage folder not found: ${folder}`);
    }

    if (!existsSync(this.filePath)) {
      writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf8');
      this.logger.warn(`Release storage initialized at ${this.filePath}`);
    }
  }

  private loadReleases(): void {
    try {
      const raw = readFileSync(this.filePath, 'utf8');
      const parsed = JSON.parse(raw) as ReleaseEntity[];
      this.releases = Array.isArray(parsed) ? parsed : [];
      this.sortReleases();
      this.logger.log(`Loaded ${this.releases.length} release(s)`);
    } catch (error) {
      this.logger.error(error, 'Unable to read release storage');
      this.releases = [];
    }
  }

  private persist(): void {
    writeFileSync(this.filePath, JSON.stringify(this.releases, null, 2), 'utf8');
  }

  private sortReleases(): void {
    this.releases.sort((left, right) => {
      if (left.publishedAt === right.publishedAt) {
        return compareVersionStrings(right.version, left.version);
      }
      return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    });
  }
}

function compareVersionStrings(a: string, b: string): number {
  const parse = (value: string) => value.split('.').map((part) => Number(part) || 0);
  const partsA = parse(a);
  const partsB = parse(b);
  for (let index = 0; index < Math.max(partsA.length, partsB.length); index += 1) {
    const diff = (partsA[index] || 0) - (partsB[index] || 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
}
