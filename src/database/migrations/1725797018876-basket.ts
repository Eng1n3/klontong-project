import { MigrationInterface, QueryRunner } from "typeorm";

export class Basket1725797018876 implements MigrationInterface {
    name = 'Basket1725797018876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "basket" ("user_id" uuid NOT NULL, "product_id" uuid NOT NULL, "basket_status_id" uuid NOT NULL, "transaction_id" uuid NOT NULL, "quantity" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_basket" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "basket" ADD CONSTRAINT "FK_basket_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "basket" ADD CONSTRAINT "FK_basket_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "basket" ADD CONSTRAINT "FK_basket_basket_status" FOREIGN KEY ("basket_status_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "basket" ADD CONSTRAINT "FK_basket_transaction" FOREIGN KEY ("transaction_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "basket" DROP CONSTRAINT "FK_basket_transaction"`);
        await queryRunner.query(`ALTER TABLE "basket" DROP CONSTRAINT "FK_basket_basket_status"`);
        await queryRunner.query(`ALTER TABLE "basket" DROP CONSTRAINT "FK_basket_product"`);
        await queryRunner.query(`ALTER TABLE "basket" DROP CONSTRAINT "FK_basket_user"`);
        await queryRunner.query(`DROP TABLE "basket"`);
    }

}
