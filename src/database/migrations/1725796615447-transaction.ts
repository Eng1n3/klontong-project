import { MigrationInterface, QueryRunner } from "typeorm";

export class Transaction1725796615447 implements MigrationInterface {
    name = 'Transaction1725796615447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions" ("id" character varying NOT NULL, "virtual_code_id" uuid, "payment_type" character varying NOT NULL, "expired_time" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_transactions" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_transactions_virtual_code" FOREIGN KEY ("virtual_code_id") REFERENCES "virtual_codes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_virtual_code"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
    }

}
