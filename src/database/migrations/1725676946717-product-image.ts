import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductImage1725676946717 implements MigrationInterface {
    name = 'ProductImage1725676946717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, "caption" character varying NOT NULL, "mime_type" character varying NOT NULL, "size" integer NOT NULL, "checksum" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_product_images" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product_images"`);
    }

}
