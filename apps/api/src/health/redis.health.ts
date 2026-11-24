import {Inject, Injectable} from "@nestjs/common";
import {HealthIndicatorService} from "@nestjs/terminus";
import {REDIS} from "../redis/redis.module.js";
import type {Redis} from "ioredis";

@Injectable()
export class RedisHealthIndicator{
    constructor(private healthIndicator: HealthIndicatorService) {
    }
    @Inject(REDIS) private readonly redis: Redis;

    async pingCheck(key: string){
        const indicator = this.healthIndicator.check(key);
        try{
            const pong = await this.redis.ping();
            return pong ==="PONG"?indicator.up():
                indicator.down({message: `unexpected reply: ${pong}`});
        } catch (error){
            return indicator.down(error instanceof Error? error.message: 'unreachable')
        }
    }

}
