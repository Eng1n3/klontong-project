import { MigrationInterface, QueryRunner } from "typeorm";

export class Product1725710773842 implements MigrationInterface {
    name = 'Product1725710773842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("product_category_id" uuid NOT NULL, "product_image_id" uuid NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sku" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "description" text NOT NULL, "weight" integer NOT NULL, "width" integer NOT NULL, "length" integer NOT NULL, "height" integer NOT NULL, "price" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_products" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_products_product_categories" FOREIGN KEY ("product_category_id") REFERENCES "product_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_products_product_images" FOREIGN KEY ("product_image_id") REFERENCES "product_images"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_products_product_images"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_products_product_categories"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
