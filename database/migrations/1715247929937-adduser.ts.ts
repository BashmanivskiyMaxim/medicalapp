import { MigrationInterface, QueryRunner } from 'typeorm';

export class Adduserts1715247929937 implements MigrationInterface {
  name = 'Adduserts1715247929937';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_procedure" DROP COLUMN "report"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_procedure" ADD "report" bytea NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_procedure" DROP COLUMN "report"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_procedure" ADD "report" json NOT NULL`,
    );
  }
}
