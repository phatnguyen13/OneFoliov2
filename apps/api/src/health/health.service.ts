import { Injectable } from '@nestjs/common';
import {HealthCheckService, PrismaHealthIndicator} from "@nestjs/terminus";
import {PrismaClient} from "../generated/prisma/client.js";
import {PrismaService} from "../prisma/prisma.service.js";
import {RedisHealthIndicator} from "./redis.health.js";

@Injectable()
export class HealthService {
    constructor(private heath: HealthCheckService,
                private prisma: PrismaService,
                private prismaIndicator: PrismaHealthIndicator,
                private redisIndicator: RedisHealthIndicator
    ) {
    }
    check(){
        return this.heath.check([
            () => this.prismaIndicator.pingCheck('database', this.prisma),
            () => this.redisIndicator.pingCheck('redis')
        ])
    }
}
