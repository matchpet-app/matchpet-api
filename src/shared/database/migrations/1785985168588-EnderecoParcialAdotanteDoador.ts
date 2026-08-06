import { MigrationInterface, QueryRunner } from "typeorm";

export class EnderecoParcialAdotanteDoador1785985168588 implements MigrationInterface {
    name = 'EnderecoParcialAdotanteDoador1785985168588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adotantes" ALTER COLUMN "endereco_bairro" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "adotantes" ALTER COLUMN "endereco_logradouro" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "adotantes" ALTER COLUMN "endereco_numero" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "doadores" ALTER COLUMN "endereco_bairro" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "doadores" ALTER COLUMN "endereco_logradouro" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "doadores" ALTER COLUMN "endereco_numero" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doadores" ALTER COLUMN "endereco_numero" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "doadores" ALTER COLUMN "endereco_logradouro" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "doadores" ALTER COLUMN "endereco_bairro" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "adotantes" ALTER COLUMN "endereco_numero" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "adotantes" ALTER COLUMN "endereco_logradouro" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "adotantes" ALTER COLUMN "endereco_bairro" SET NOT NULL`);
    }

}
