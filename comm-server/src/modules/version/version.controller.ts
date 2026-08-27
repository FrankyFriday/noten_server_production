import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { CreateReleaseDto } from './dto/create-release.dto';
import { ReleaseResponseDto } from './dto/release-response.dto';
import { VersionService } from './version.service';

@Controller('version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Get()
  getVersion(): ReleaseResponseDto {
    return this.versionService.getLatestRelease();
  }

  @Get('releases/latest')
  getLatestRelease(): ReleaseResponseDto {
    return this.versionService.getLatestRelease();
  }

  @Post('releases')
  @UseGuards(ApiKeyGuard)
  createRelease(@Body() createReleaseDto: CreateReleaseDto): ReleaseResponseDto {
    return this.versionService.createRelease(createReleaseDto);
  }
}
