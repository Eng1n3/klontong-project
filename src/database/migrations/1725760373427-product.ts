import { MigrationInterface, QueryRunner } from "typeorm";

export class Product1725760373427 implements MigrationInterface {
    name = 'Product1725760373427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("product_category_id" uuid NOT NULL, "file_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sku" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "description" text NOT NULL, "weight" double precision NOT NULL, "width" double precision NOT NULL, "length" double precision NOT NULL, "height" double precision NOT NULL, "price" double precision NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_products" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_products_product_categories" FOREIGN KEY ("product_category_id") REFERENCES "product_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_products_files" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_products_files"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_products_product_categories"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
