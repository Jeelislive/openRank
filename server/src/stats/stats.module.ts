import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Project } from '../projects/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}

