import { Controller, Get, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getProjects(
    @Query('category') category?: string,
    @Query('language') language?: string,
    @Query('sortBy') sortBy?: string,
    @Query('minStars') minStars?: string,
    @Query('search') search?: string,
  ) {
    return this.projectsService.findAll({
      category,
      language,
      sortBy,
      minStars: minStars ? parseInt(minStars) : undefined,
      search,
    });
  }
}
