import { MigrationInterface, QueryRunner } from "typeorm";

export class User1725761193505 implements MigrationInterface {
    name = 'User1725761193505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("file_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "phone_number" character varying(100) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_user" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_user_files" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_user_files"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
