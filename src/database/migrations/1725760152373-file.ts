import { MigrationInterface, QueryRunner } from "typeorm";

export class File1725760152373 implements MigrationInterface {
    name = 'File1725760152373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, "caption" character varying(100) NOT NULL, "mime_type" character varying NOT NULL, "size" double precision NOT NULL, "checksum" character varying NOT NULL, "is_main" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_files" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "files"`);
    }

}
