import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {validateEnv} from "./config/env.schema.js";
import {PrismaModule} from "./prisma/prisma.module.js";
import { HealthController } from './health/health.controller.js';
import { HealthService } from './health/health.service.js';
import {TerminusModule} from "@nestjs/terminus";
import { RedisModule } from './redis/redis.module.js';
import {LoggerModule} from "nestjs-pino";
import {randomUUID} from "crypto";
import {RedisHealthIndicator} from "./health/redis.health.js";

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ConfigModule.forRoot({
        isGlobal: true,
        cache: true,
        envFilePath: new URL('../../../.env', import.meta.url).pathname,
        validate: validateEnv,
    }),
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'api',
    }),
      PrismaModule,
      TerminusModule,
      RedisModule,
      LoggerModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
              pinoHttp: {
                  genReqId: (req, res) => {
                      const id =req.headers['x-request-id']??randomUUID();
                      res.setHeaders(new Map([['X-Request-Id', id]]));
                      return id;
                  },
                  autoLogging: {
                      ignore: (req) => req.url?.startsWith('/health')?? false
                  },
                  transport: config.get('NODE_ENV') === 'development'?{
                      target: 'pino-pretty', options: {singleLine: true}
                  } : undefined
              }
          })
      })
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService, RedisHealthIndicator],
})
export class AppModule {}
