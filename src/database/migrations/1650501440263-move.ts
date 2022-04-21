import { MigrationInterface, QueryRunner } from 'typeorm';

export class move1650501440263 implements MigrationInterface {
  name = 'move1650501440263';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "move" ("id" SERIAL NOT NULL, "detail" character varying(64) NOT NULL, "amount" numeric NOT NULL, "date" date NOT NULL, "type" character varying(8) NOT NULL, "accountId" integer, CONSTRAINT "PK_0befa9c6b3a216e49c494b4acc5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "move" ADD CONSTRAINT "FK_3a2050932bcef8dc112f05cd4a8" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "move" DROP CONSTRAINT "FK_3a2050932bcef8dc112f05cd4a8"`,
    );
    await queryRunner.query(`DROP TABLE "move"`);
  }
}
