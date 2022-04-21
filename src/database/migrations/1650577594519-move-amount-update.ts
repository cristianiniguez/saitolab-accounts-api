import { MigrationInterface, QueryRunner } from 'typeorm';

export class moveAmountUpdate1650577594519 implements MigrationInterface {
  name = 'moveAmountUpdate1650577594519';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "move" ALTER COLUMN "amount" TYPE numeric(8,2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "move" ALTER COLUMN "amount" TYPE numeric`,
    );
  }
}
