import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CatModule } from './modules/cat/cat.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
      envFilePath: '.env',
    }),
    CatModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
