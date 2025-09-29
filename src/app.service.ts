import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'NestJS API with JWT authentication is running',
    };
  }
}
