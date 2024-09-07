import { MigrationInterface, QueryRunner } from "typeorm";

export class Seeder1725673448699 implements MigrationInterface {
    name = 'Seeder1725673448699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "seeders" ("id" SERIAL NOT NULL, "timestamp" bigint NOT NULL, "name" character varying NOT NULL, CONSTRAINT "pk_seeders" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "seeders"`);
    }

}
