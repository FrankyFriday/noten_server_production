import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';
import { ReleaseRepository } from './repository/release.repository';
import { UpdatesGateway } from '../../gateways/updates.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [VersionController],
  providers: [VersionService, ReleaseRepository, UpdatesGateway],
  exports: [VersionService],
})
export class VersionModule {}
