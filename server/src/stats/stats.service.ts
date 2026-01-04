import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/project.entity';
import { Visit } from './visit.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Visit)
    private visitRepository: Repository<Visit>,
  ) {}

  async getStats() {
    const totalProjects = await this.projectsRepository.count();
    
    const result = await this.projectsRepository
      .createQueryBuilder('project')
      .select('SUM(project.forks)', 'totalCommits')
      .getRawOne();
    
    const totalCommits = parseInt(result.totalCommits || '0');
    
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
    const visitRecord = await this.visitRepository.findOne({ where: {} });
    
    if (!visitRecord) {
      const newRecord = this.visitRepository.create({ count: 1 });
      await this.visitRepository.save(newRecord);
    } else {
      await this.visitRepository.increment({ id: visitRecord.id }, 'count', 1);
    }
    
    return { success: true };
  }

  async getUsersVisited() {
    let visitRecord = await this.visitRepository.findOne({ where: {} });
    
    if (!visitRecord) {
      visitRecord = this.visitRepository.create({ count: 0 });
      await this.visitRepository.save(visitRecord);
    }
    
    return { count: visitRecord.count };
  }
}

