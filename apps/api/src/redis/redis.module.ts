import { Module } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import  {Redis} from "ioredis";

export const REDIS = "REDIS_CLIENT";

@Module({
    providers:[
        {
            provide: REDIS,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => new Redis(config.getOrThrow<string>('REDIS_URL'),{
                maxRetriesPerRequest: 1,
                lazyConnect: false
            })
        }

    ],
    exports: [REDIS]
})
export class RedisModule {}
