import { Controller, Delete } from '@nestjs/common';
import { TestService } from '../services/test.service';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Delete()
  async reset() {
    await this.testService.deleteMoves();
    await this.testService.deleteAccounts();
    await this.testService.deleteUsers();
    return 'All data deleted';
  }
}
