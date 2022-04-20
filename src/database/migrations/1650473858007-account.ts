import { MigrationInterface, QueryRunner } from 'typeorm';

export class account1650473858007 implements MigrationInterface {
  name = 'account1650473858007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "account" ("id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, "userId" integer, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`,
    );
    await queryRunner.query(`DROP TABLE "account"`);
  }
}
