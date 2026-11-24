import {PrismaClient} from "../generated/prisma/client.js";
import {Injectable, OnModuleInit} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {PrismaPg} from "@prisma/adapter-pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    constructor(config: ConfigService) {
        super({
            adapter: new PrismaPg({
                connectionString: config.getOrThrow<string>("DATABASE_URL")
            })
        });

    }


    async onModuleInit() {

        await this.$connect();
    }
}
