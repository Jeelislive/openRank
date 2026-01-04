import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/project.entity';

@Injectable()
export class StatsService {
  private visitCount: number = 0;

  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {
    // Initialize with a base count (can be loaded from database in production)
    this.visitCount = 0;
  }

  async getStats() {
    const totalProjects = await this.projectsRepository.count();
    
    // Calculate total commits (sum of forks as approximation)
    const result = await this.projectsRepository
      .createQueryBuilder('project')
      .select('SUM(project.forks)', 'totalCommits')
      .getRawOne();
    
    const totalCommits = parseInt(result.totalCommits || '0');
    
    // Calculate total contributors (sum of contributors)
    const contributorsResult = await this.projectsRepository
      .createQueryBuilder('project')
      .select('SUM(project.contributors)', 'totalContributors')
      .getRawOne();
    
    const totalContributors = parseInt(contributorsResult.totalContributors || '0');

    return {
      totalProjects,
      totalCommits,
      totalContributors,
    };
  }

  async trackVisit() {
    // Increment visit count
    this.visitCount++;
    return { success: true };
  }

  async getUsersVisited() {
    return { count: this.visitCount };
  }
}

