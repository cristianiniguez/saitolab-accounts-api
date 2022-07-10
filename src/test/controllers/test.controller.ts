import { Controller, Delete } from '@nestjs/common';
import { TestService } from '../services/test.service';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Delete('users')
  async deleteUsers() {
    await this.testService.deleteUsers();
    return 'Users deleted';
  }

  @Delete('accounts')
  async deleteAccounts() {
    await this.testService.deleteAccounts();
    return 'Accounts deleted';
  }

  @Delete('moves')
  async deleteMoves() {
    await this.testService.deleteMoves();
    return 'Moves deleted';
  }
}
