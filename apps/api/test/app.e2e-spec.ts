import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import {AppService} from "../src/app.service.js";
import {HealthCheckService} from "@nestjs/terminus";
import {AppController} from "../src/app.controller.js";
import {PrismaService} from "../src/prisma/prisma.service.js";

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
    const prismaMock = {
        user: {
            count: vi.fn().mockResolvedValue(0)
        }
    }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
        controllers: [AppController],
        providers: [AppService, {
          provide: PrismaService,
            useValue: prismaMock
        } ]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    await app.close();
  });
});
