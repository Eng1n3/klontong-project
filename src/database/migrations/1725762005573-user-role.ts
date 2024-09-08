import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRole1725762005573 implements MigrationInterface {
    name = 'UserRole1725762005573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_user_roles" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_user_roles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_user_roles_roles" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_roles"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_user"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
    }

}
