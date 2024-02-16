import { MigrationInterface, QueryRunner } from 'typeorm';

export class MedicalProcHistory1708095582049 implements MigrationInterface {
  name = 'MedicalProcHistory1708095582049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "medical_history" DROP COLUMN "date"`);
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "recovery_status" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD "additional_info" json DEFAULT '{}' NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_procedure" ADD "created_date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_procedure" ADD "updated_date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_procedure" ADD "procedure_info" json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_history" ADD "created_date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_history" ADD "updated_date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_history" ADD "medical_info" json NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medical_history" DROP COLUMN "medical_info"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_history" DROP COLUMN "updated_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_history" DROP COLUMN "created_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_procedure" DROP COLUMN "procedure_info"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_procedure" DROP COLUMN "updated_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_procedure" DROP COLUMN "created_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP COLUMN "additional_info"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP COLUMN "recovery_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_history" ADD "date" character varying NOT NULL`,
    );
  }
}
