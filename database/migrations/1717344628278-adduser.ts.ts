import { MigrationInterface, QueryRunner } from 'typeorm';

export class Adduserts1717344628278 implements MigrationInterface {
  name = 'Adduserts1717344628278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."idx_unique_patient_date_time"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure" ADD "deleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ALTER COLUMN "additional_info" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient" ALTER COLUMN "additional_info" SET DEFAULT E'\\\\x'`,
    );
    await queryRunner.query(`ALTER TABLE "procedure" DROP COLUMN "deleted"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_unique_patient_date_time" ON "patient_procedure" ("patient_id", "procedure_date", "appointment_time") WHERE ((patient_id <> 28) AND (patient_id <> 29))`,
    );
  }
}
