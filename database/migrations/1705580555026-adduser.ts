import { MigrationInterface, QueryRunner } from 'typeorm';

export class MedicalServiceMigration1627564888161
  implements MigrationInterface
{
  name = 'MedicalServiceMigration1627564888161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "contact_info" ("id" SERIAL NOT NULL, "contactNumber" character varying NOT NULL, "account_id" integer, CONSTRAINT "REL_dfdce2c1b2adf2eda1abaca0ba" UNIQUE ("account_id"), CONSTRAINT "PK_65b98fa4ffb26dceb9192f5d496" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "address" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "account_id" integer, CONSTRAINT "REL_59e520beb3bb0606a3a0c2dc79" UNIQUE ("account_id"), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "doctor" ("id" SERIAL NOT NULL, "specialty" character varying NOT NULL, "qualification" character varying NOT NULL, "account_id" integer, CONSTRAINT "REL_84f937084ebb63fc4ae2de084d" UNIQUE ("account_id"), CONSTRAINT "PK_ee6bf6c8de78803212c548fcb94" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "role" character varying NOT NULL, "messageContent" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "sender_id" integer, "receiver_id" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" text NOT NULL, "createdate" TIMESTAMP NOT NULL DEFAULT now(), "updateddate" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "last_login" TIMESTAMP, "hach_refresh_token" character varying, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "accountType" character varying NOT NULL, CONSTRAINT "UQ_41dfcb70af895ddf9a53094515b" UNIQUE ("username"), CONSTRAINT "UQ_4c8f96ccf523e9a3faefd5bdd4c" UNIQUE ("email"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_41dfcb70af895ddf9a53094515" ON "account" ("username") `,
    );
    await queryRunner.query(
      `CREATE TABLE "patient" ("id" SERIAL NOT NULL, "account_id" integer, "doctor_id" integer, CONSTRAINT "REL_1157ef64d9590acc21e73adb25" UNIQUE ("account_id"), CONSTRAINT "PK_8dfa510bb29ad31ab2139fbfb99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "dayOfWeek" character varying NOT NULL, "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "doctor_id" integer, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "appointment" ("id" SERIAL NOT NULL, "appointmentDate" character varying NOT NULL, "appointmentTime" character varying NOT NULL, "reason" character varying NOT NULL, "patient_id" integer, "doctor_id" integer, "schedule_id" integer, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "medical_procedure" ("id" SERIAL NOT NULL, "procedureType" character varying NOT NULL, "description" character varying NOT NULL, "medical_history_id" integer, CONSTRAINT "PK_0e0030770c9b16c199869d0c134" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "medical_history" ("id" SERIAL NOT NULL, "date" character varying NOT NULL, "patient_id" integer, CONSTRAINT "PK_b74f21cb30300ddf41a00623568" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_info" ADD CONSTRAINT "FK_dfdce2c1b2adf2eda1abaca0ba0" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_59e520beb3bb0606a3a0c2dc797" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" ADD CONSTRAINT "FK_84f937084ebb63fc4ae2de084d8" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6" FOREIGN KEY ("sender_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_f4da40532b0102d51beb220f16a" FOREIGN KEY ("receiver_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD CONSTRAINT "FK_1157ef64d9590acc21e73adb259" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD CONSTRAINT "FK_e10105a04a8a381baec6ba1fc6a" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD CONSTRAINT "FK_bab091ad4033b47e7aaa59bbc6f" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_86b3e35a97e289071b4785a1402" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_9a9c484aa4a944eaec632e00a81" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_1dd29956529ee1c9cf4a055312f" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_procedure" ADD CONSTRAINT "FK_be238bf20de79f5277bf1046dd0" FOREIGN KEY ("medical_history_id") REFERENCES "medical_history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_history" ADD CONSTRAINT "FK_83285d6666f520246b9bd410833" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medical_history" DROP CONSTRAINT "FK_83285d6666f520246b9bd410833"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_procedure" DROP CONSTRAINT "FK_be238bf20de79f5277bf1046dd0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_1dd29956529ee1c9cf4a055312f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_9a9c484aa4a944eaec632e00a81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_86b3e35a97e289071b4785a1402"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule" DROP CONSTRAINT "FK_bab091ad4033b47e7aaa59bbc6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "FK_e10105a04a8a381baec6ba1fc6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "FK_1157ef64d9590acc21e73adb259"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_f4da40532b0102d51beb220f16a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor" DROP CONSTRAINT "FK_84f937084ebb63fc4ae2de084d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_59e520beb3bb0606a3a0c2dc797"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_info" DROP CONSTRAINT "FK_dfdce2c1b2adf2eda1abaca0ba0"`,
    );
    await queryRunner.query(`DROP TABLE "medical_history"`);
    await queryRunner.query(`DROP TABLE "medical_procedure"`);
    await queryRunner.query(`DROP TABLE "appointment"`);
    await queryRunner.query(`DROP TABLE "schedule"`);
    await queryRunner.query(`DROP TABLE "patient"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_41dfcb70af895ddf9a53094515"`,
    );
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "doctor"`);
    await queryRunner.query(`DROP TABLE "address"`);
    await queryRunner.query(`DROP TABLE "contact_info"`);
  }
}
