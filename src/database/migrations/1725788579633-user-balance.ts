import { MigrationInterface, QueryRunner } from "typeorm";

export class UserBalance1725788579633 implements MigrationInterface {
    name = 'UserBalance1725788579633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_balance" ("userId" character varying NOT NULL, "balance" double precision NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, CONSTRAINT "PK_user_balance_user" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`ALTER TABLE "user_balance" ADD CONSTRAINT "FK_user_balance_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_balance" DROP CONSTRAINT "FK_user_balance_user"`);
        await queryRunner.query(`DROP TABLE "user_balance"`);
    }

}
