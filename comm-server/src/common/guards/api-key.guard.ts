import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'] || request.headers['authorization'];
    const configuredKey = this.configService.get<string>('app.apiKey');

    if (!configuredKey || !apiKey) {
      throw new UnauthorizedException('Missing API key');
    }

    const normalizedApiKey = Array.isArray(apiKey) ? apiKey[0] : apiKey;
    if (normalizedApiKey !== configuredKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
