import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service.js';
import {HealthCheckService, PrismaHealthIndicator} from "@nestjs/terminus";
import {RedisHealthIndicator} from "./redis.health.js";
import {PrismaService} from "../prisma/prisma.service.js";

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService,
          { provide: HealthCheckService, useValue: { check: vi.fn() } },
          { provide: PrismaHealthIndicator, useValue: { pingCheck: vi.fn() } },
          { provide: RedisHealthIndicator, useValue: { pingCheck: vi.fn() } },
          { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
