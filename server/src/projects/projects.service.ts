import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Project } from './project.entity';
import { GitHubService } from '../github/github.service';

export interface ProjectFilters {
  category?: string;
  language?: string;
  sortBy?: string;
  minStars?: number;
  search?: string;
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private githubService: GitHubService,
  ) {}

  async findAll(filters: ProjectFilters) {
    // If search query is provided, search GitHub instead of database
    if (filters.search && filters.search.trim().length > 0) {
      return this.searchGitHub(filters);
    }

    // Otherwise, query from database
    const queryBuilder = this.projectsRepository.createQueryBuilder('project');

    // Apply filters
    if (filters.category) {
      queryBuilder.andWhere('project.category = :category', {
        category: filters.category,
      });
    }

    if (filters.language) {
      queryBuilder.andWhere('project.language = :language', {
        language: filters.language,
      });
    }

    if (filters.minStars) {
      queryBuilder.andWhere('project.stars >= :minStars', {
        minStars: filters.minStars,
      });
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'Stars':
        queryBuilder.orderBy('project.stars', 'DESC');
        break;
      case 'Forks':
        queryBuilder.orderBy('project.forks', 'DESC');
        break;
      case 'Recently Updated':
        queryBuilder.orderBy('project.lastUpdated', 'ASC');
        break;
      case 'Most Active':
        queryBuilder.orderBy('project.contributors', 'DESC');
        break;
      default:
        queryBuilder.orderBy('project.rank', 'ASC');
    }

    const projects = await queryBuilder.getMany();

    return {
      projects,
      total: projects.length,
    };
  }

  async searchGitHub(filters: ProjectFilters) {
    try {
      const sortBy = filters.sortBy || 'Stars';
      const order = sortBy === 'Stars' || sortBy === 'Forks' ? 'desc' : 'desc';
      
      const githubResponse = await this.githubService.searchRepositories(
        filters.search!,
        filters.language !== 'All' ? filters.language : undefined,
        sortBy,
        order,
        30,
      );

      // Map GitHub repositories to our Project format
      // Note: We skip contributors count to speed up response (can be slow for many repos)
      const projects = githubResponse.items.map((repo, index) => {
          // Calculate rank based on stars (simple ranking)
          const rank = index + 1;

          // Determine category based on language or topics
          let category = 'Other';
          if (repo.language) {
            const lang = repo.language.toLowerCase();
            if (['javascript', 'typescript', 'react', 'vue', 'angular'].some(l => lang.includes(l))) {
              category = 'Frontend';
            } else if (['python', 'java', 'go', 'rust', 'c++', 'c#', 'php', 'ruby'].some(l => lang.includes(l))) {
              category = 'Backend';
            } else if (['swift', 'kotlin', 'dart', 'objective-c'].some(l => lang.includes(l))) {
              category = 'Mobile';
            } else if (['docker', 'kubernetes', 'terraform', 'ansible'].some(l => lang.includes(l))) {
              category = 'DevOps';
            }
          }

          // Use topics as tags, or generate from language
          const tags = repo.topics && repo.topics.length > 0 
            ? repo.topics.slice(0, 5)
            : repo.language 
              ? [repo.language]
              : [];

          // Format last updated
          const lastUpdated = this.formatLastUpdated(repo.updated_at);

          return {
            id: repo.id,
            name: repo.name,
            description: repo.description || 'No description available',
            rank,
            tags,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            status: 'Active',
            language: repo.language || 'Unknown',
            category,
            lastUpdated,
            contributors: 0, // Contributors count removed for performance (can be slow)
            githubUrl: repo.html_url,
            fullName: repo.full_name,
          } as Project;
        });

      // Apply minStars filter if specified
      let filteredProjects = projects;
      if (filters.minStars) {
        filteredProjects = projects.filter(p => p.stars >= filters.minStars!);
      }

      return {
        projects: filteredProjects,
        total: filteredProjects.length,
      };
    } catch (error) {
      console.error('GitHub search error:', error);
      // Return empty results on error
      return {
        projects: [],
        total: 0,
      };
    }
  }

  private formatLastUpdated(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  async getCategories(): Promise<string[]> {
    const result = await this.projectsRepository
      .createQueryBuilder('project')
      .select('DISTINCT project.category', 'category')
      .getRawMany();
    
    return result.map((r) => r.category).filter(Boolean);
  }

  async getLanguages(): Promise<string[]> {
    const result = await this.projectsRepository
      .createQueryBuilder('project')
      .select('DISTINCT project.language', 'language')
      .getRawMany();
    
    return result.map((r) => r.language).filter(Boolean);
  }
}

