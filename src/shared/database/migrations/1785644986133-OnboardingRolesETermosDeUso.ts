import { MigrationInterface, QueryRunner } from "typeorm";

export class OnboardingRolesETermosDeUso1785644986133 implements MigrationInterface {
    name = 'OnboardingRolesETermosDeUso1785644986133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_roles_role_enum" AS ENUM('adotante', 'doador', 'admin')`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("user_id" uuid NOT NULL, "role" "public"."user_roles_role_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_09d115a69b6014d324d592f9c42" PRIMARY KEY ("user_id", "role"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "termos_de_uso_aceitos_em" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "termos_de_uso_versao" character varying`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "termos_de_uso_versao"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "termos_de_uso_aceitos_em"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('adotante', 'doador', 'admin')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TYPE "public"."user_roles_role_enum"`);
    }

}
