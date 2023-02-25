import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): any {
    return { status: 'up', node_env: process.env.NODE_ENV };
  }
}
