import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health-check')
@Controller('health-check')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Status application' })
  @ApiResponse({
    status: 200,
    description: '',
  })
  @Get()
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
