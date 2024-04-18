import { MigrationInterface, QueryRunner } from 'typeorm';

export class Adduserts1713439585933 implements MigrationInterface {
  name = 'Adduserts1713439585933';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "FK_e10105a04a8a381baec6ba1fc6a"`,
    );
    await queryRunner.query(
      `CREATE TABLE "procedure" ("id" SERIAL NOT NULL, "doctor_id" integer NOT NULL, "procedure_name" character varying NOT NULL, "procedure_description" character varying NOT NULL, "average_rating" double precision NOT NULL, CONSTRAINT "PK_9888785b528492e7539d96e3894" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "patient_procedure" ("id" SERIAL NOT NULL, "patient_id" integer NOT NULL, "doctor_id" integer NOT NULL, "procedure_id" integer NOT NULL, "procedure_date" date NOT NULL, "created_date" TIMESTAMP NOT NULL, "updated_date" TIMESTAMP NOT NULL, "appointment_time" TIME NOT NULL, "report" json NOT NULL, "rating" integer NOT NULL, CONSTRAINT "PK_1fd78d3d4428174cb656feb8744" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "doctor_id"`);
    await queryRunner.query(
      `ALTER TABLE "procedure" ADD CONSTRAINT "FK_6272d3641c10f3c2e4c93612c1a" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_procedure" ADD CONSTRAINT "FK_97be56392b3165d4fdbc1ab4efd" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_procedure" ADD CONSTRAINT "FK_2364edfce10081d6aeacc0bf6c6" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_procedure" ADD CONSTRAINT "FK_c0c57c1ed5c25ff871f225288e3" FOREIGN KEY ("procedure_id") REFERENCES "procedure"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_procedure" DROP CONSTRAINT "FK_c0c57c1ed5c25ff871f225288e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_procedure" DROP CONSTRAINT "FK_2364edfce10081d6aeacc0bf6c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_procedure" DROP CONSTRAINT "FK_97be56392b3165d4fdbc1ab4efd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedure" DROP CONSTRAINT "FK_6272d3641c10f3c2e4c93612c1a"`,
    );
    await queryRunner.query(`ALTER TABLE "patient" ADD "doctor_id" integer`);
    await queryRunner.query(`DROP TABLE "patient_procedure"`);
    await queryRunner.query(`DROP TABLE "procedure"`);
    await queryRunner.query(
      `ALTER TABLE "patient" ADD CONSTRAINT "FK_e10105a04a8a381baec6ba1fc6a" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
