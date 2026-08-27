import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import * as Joi from 'joi';
import { appConfig } from './common/config/app.config';
import { HealthModule } from './modules/health/health.module';
import { VersionModule } from './modules/version/version.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('production'),
        PORT: Joi.number().default(3000),
        API_KEY: Joi.string().required(),
        RELEASE_DATA_PATH: Joi.string().default('./data/releases.json'),
        MAINTENANCE_MODE: Joi.boolean().default(false),
        LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('info'),
      }),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie', 'req.headers.cookie'],
          remove: true,
        },
      },
    }),
    VersionModule,
    HealthModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
