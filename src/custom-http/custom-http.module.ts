import { Module } from '@nestjs/common';
import { CustomHttpService } from './custom-http.service';
import { CustomHttpController } from './custom-http.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CustomHttpService],
  controllers: [CustomHttpController],
  exports: [CustomHttpService],
})
export class CustomHttpModule {}
