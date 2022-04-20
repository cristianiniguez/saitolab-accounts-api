import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1650467558009 implements MigrationInterface {
  name = 'init1650467558009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(32) NOT NULL, "password" character varying(128) NOT NULL, "firstName" character varying(32) NOT NULL, "lastName" character varying(32) NOT NULL, "role" character varying(8) NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
