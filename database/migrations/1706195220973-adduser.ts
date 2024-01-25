import { MigrationInterface, QueryRunner } from 'typeorm';

export class Adduserts1706195220973 implements MigrationInterface {
  name = 'Adduserts1706195220973';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doctor" DROP CONSTRAINT "FK_84f937084ebb63fc4ae2de084d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" DROP CONSTRAINT "REL_84f937084ebb63fc4ae2de084d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "FK_1157ef64d9590acc21e73adb259"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "REL_1157ef64d9590acc21e73adb25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" ADD CONSTRAINT "FK_84f937084ebb63fc4ae2de084d8" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD CONSTRAINT "FK_1157ef64d9590acc21e73adb259" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "FK_1157ef64d9590acc21e73adb259"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" DROP CONSTRAINT "FK_84f937084ebb63fc4ae2de084d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD CONSTRAINT "REL_1157ef64d9590acc21e73adb25" UNIQUE ("account_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD CONSTRAINT "FK_1157ef64d9590acc21e73adb259" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" ADD CONSTRAINT "REL_84f937084ebb63fc4ae2de084d" UNIQUE ("account_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" ADD CONSTRAINT "FK_84f937084ebb63fc4ae2de084d8" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
