import { MigrationInterface, QueryRunner } from 'typeorm';

export class Adduserts1715256823927 implements MigrationInterface {
  name = 'Adduserts1715256823927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient" DROP COLUMN "additional_info"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "additional_info" bytea NOT NULL DEFAULT E'\\\\x'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient" DROP COLUMN "additional_info"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "additional_info" json NOT NULL DEFAULT '{}'`,
    );
  }
}
