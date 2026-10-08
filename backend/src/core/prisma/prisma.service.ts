import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {ConfigService} from "@nestjs/config";
import {PrismaMariaDb} from "@prisma/adapter-mariadb";

@Injectable()
export class PrismaService
extends PrismaClient
implements OnModuleInit, OnModuleDestroy
{
    constructor(configService: ConfigService) {
        const dbUrlString = configService.getOrThrow('DATABASE_URL')
        const dbUrl = new URL(dbUrlString)

        const adapter = new PrismaMariaDb({
            host: dbUrl.hostname,
            port: Number(dbUrl.port) || 3306,
            user: dbUrl.username,
            password: dbUrl.password,
            database: dbUrl.pathname.slice(1),
        })
        super({ adapter });
    }
    async onModuleInit(){
        await this.$connect()
    }
    async onModuleDestroy(){
        await this.$disconnect()
    }
}
