import { Test, TestingModule } from '@nestjs/testing';
import { CustomHttpService } from './custom-http.service';

describe('CustomHttpService', () => {
  let service: CustomHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomHttpService],
    }).compile();

    service = module.get<CustomHttpService>(CustomHttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
