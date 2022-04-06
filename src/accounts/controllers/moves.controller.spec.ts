import { Test, TestingModule } from '@nestjs/testing';
import { MovesController } from './moves.controller';

describe('MovesController', () => {
  let controller: MovesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovesController],
    }).compile();

    controller = module.get<MovesController>(MovesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
