import { Controller, Get, Post } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('api/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getStats() {
    return this.statsService.getStats();
  }

  @Post('visit')
  async trackVisit() {
    return this.statsService.trackVisit();
  }

  @Get('users-visited')
  async getUsersVisited() {
    return this.statsService.getUsersVisited();
  }
}

