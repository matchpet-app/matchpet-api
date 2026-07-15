import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1784130937083 implements MigrationInterface {
    name = 'InitialSchema1784130937083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('adotante', 'doador', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password_hash" character varying, "google_id" character varying, "role" "public"."users_role_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b" UNIQUE ("google_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."adocoes_historico_status_anterior_enum" AS ENUM('pendente', 'aprovado', 'rejeitado', 'concluido', 'cancelado')`);
        await queryRunner.query(`CREATE TYPE "public"."adocoes_historico_status_novo_enum" AS ENUM('pendente', 'aprovado', 'rejeitado', 'concluido', 'cancelado')`);
        await queryRunner.query(`CREATE TABLE "adocoes_historico" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "adocao_id" uuid NOT NULL, "status_anterior" "public"."adocoes_historico_status_anterior_enum", "status_novo" "public"."adocoes_historico_status_novo_enum" NOT NULL, "alterado_por_user_id" uuid, "observacao" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_69b740039bc7fe196b4a444f0a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."adotantes_endereco_uf_enum" AS ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO')`);
        await queryRunner.query(`CREATE TYPE "public"."adotantes_moradia_tipo_enum" AS ENUM('casa', 'apartamento', 'outro')`);
        await queryRunner.query(`CREATE TYPE "public"."adotantes_moradia_posse_enum" AS ENUM('propria', 'alugada', 'cedida')`);
        await queryRunner.query(`CREATE TYPE "public"."adotantes_moradia_tela_protecao_enum" AS ENUM('sim', 'nao', 'planeja_instalar')`);
        await queryRunner.query(`CREATE TABLE "adotantes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "nome_completo" character varying NOT NULL, "data_nascimento" date NOT NULL, "cpf" character varying NOT NULL, "telefone" character varying NOT NULL, "verificado" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "endereco_cep" character varying NOT NULL, "endereco_uf" "public"."adotantes_endereco_uf_enum" NOT NULL, "endereco_cidade" character varying NOT NULL, "endereco_bairro" character varying NOT NULL, "endereco_logradouro" character varying NOT NULL, "endereco_numero" character varying NOT NULL, "endereco_complemento" character varying, "moradia_tipo" "public"."adotantes_moradia_tipo_enum" NOT NULL, "moradia_posse" "public"."adotantes_moradia_posse_enum" NOT NULL, "moradia_tela_protecao" "public"."adotantes_moradia_tela_protecao_enum" NOT NULL, "moradia_composicao_familiar_adultos" integer NOT NULL DEFAULT '0', "moradia_composicao_familiar_criancas" jsonb NOT NULL DEFAULT '[]', "moradia_composicao_familiar_outros_pets" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "UQ_6aff9283baa0112be06a0ab093f" UNIQUE ("user_id"), CONSTRAINT "UQ_eeab54675ff54e6e98fe4f31587" UNIQUE ("cpf"), CONSTRAINT "REL_6aff9283baa0112be06a0ab093" UNIQUE ("user_id"), CONSTRAINT "PK_7e35501cc11dd81f1bfb55e0597" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."doadores_tipo_enum" AS ENUM('pessoa_fisica', 'abrigo_ong')`);
        await queryRunner.query(`CREATE TYPE "public"."doadores_endereco_uf_enum" AS ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO')`);
        await queryRunner.query(`CREATE TABLE "doadores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "tipo" "public"."doadores_tipo_enum" NOT NULL, "nome_exibicao" character varying NOT NULL, "cpf" character varying, "cnpj" character varying, "telefone" character varying NOT NULL, "descricao" text, "verificado" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "endereco_cep" character varying NOT NULL, "endereco_uf" "public"."doadores_endereco_uf_enum" NOT NULL, "endereco_cidade" character varying NOT NULL, "endereco_bairro" character varying NOT NULL, "endereco_logradouro" character varying NOT NULL, "endereco_numero" character varying NOT NULL, "endereco_complemento" character varying, CONSTRAINT "UQ_26d351a426efddb5c48390c1239" UNIQUE ("user_id"), CONSTRAINT "UQ_c850fbfc348677d45d3d045d0e9" UNIQUE ("cpf"), CONSTRAINT "UQ_3017635ab38c0c6d8a83279e36b" UNIQUE ("cnpj"), CONSTRAINT "REL_26d351a426efddb5c48390c123" UNIQUE ("user_id"), CONSTRAINT "PK_dd8a2e03edd114f3fe4a9919481" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fotos_pet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pet_id" uuid NOT NULL, "url" character varying NOT NULL, "ordem" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_19594af63c1ab5a1669d30a4549" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."pets_especie_enum" AS ENUM('cachorro', 'gato', 'coelho', 'outro')`);
        await queryRunner.query(`CREATE TYPE "public"."pets_porte_enum" AS ENUM('P', 'M', 'G')`);
        await queryRunner.query(`CREATE TYPE "public"."pets_sexo_enum" AS ENUM('macho', 'femea')`);
        await queryRunner.query(`CREATE TYPE "public"."pets_nivel_energia_enum" AS ENUM('baixo', 'moderado', 'alto')`);
        await queryRunner.query(`CREATE TYPE "public"."pets_status_enum" AS ENUM('disponivel', 'em_processo', 'adotado', 'indisponivel')`);
        await queryRunner.query(`CREATE TYPE "public"."pets_compatibilidade_convive_com_criancas_enum" AS ENUM('sim', 'nao', 'nao_testado')`);
        await queryRunner.query(`CREATE TYPE "public"."pets_compatibilidade_convive_com_outros_pets_enum" AS ENUM('sim', 'nao', 'nao_testado')`);
        await queryRunner.query(`CREATE TYPE "public"."pets_compatibilidade_convive_com_gatos_enum" AS ENUM('sim', 'nao', 'nao_testado')`);
        await queryRunner.query(`CREATE TABLE "pets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "doador_id" uuid NOT NULL, "nome" character varying NOT NULL, "especie" "public"."pets_especie_enum" NOT NULL, "raca" character varying, "data_nascimento_estimada" date, "idade_aproximada_meses" integer, "porte" "public"."pets_porte_enum" NOT NULL, "sexo" "public"."pets_sexo_enum" NOT NULL, "cor_predominante" character varying, "nivel_energia" "public"."pets_nivel_energia_enum" NOT NULL, "descricao" text NOT NULL, "status" "public"."pets_status_enum" NOT NULL DEFAULT 'disponivel', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "saude_vacinado" boolean NOT NULL DEFAULT false, "saude_vermifugado" boolean NOT NULL DEFAULT false, "saude_castrado" boolean NOT NULL DEFAULT false, "saude_possui_deficiencia" boolean NOT NULL DEFAULT false, "saude_descricao_deficiencia" character varying, "saude_observacoes_medicas" text, "compatibilidade_convive_com_criancas" "public"."pets_compatibilidade_convive_com_criancas_enum" NOT NULL DEFAULT 'nao_testado', "compatibilidade_convive_com_outros_pets" "public"."pets_compatibilidade_convive_com_outros_pets_enum" NOT NULL DEFAULT 'nao_testado', "compatibilidade_convive_com_gatos" "public"."pets_compatibilidade_convive_com_gatos_enum" NOT NULL DEFAULT 'nao_testado', CONSTRAINT "PK_d01e9e7b4ada753c826720bee8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."adocoes_status_enum" AS ENUM('pendente', 'aprovado', 'rejeitado', 'concluido', 'cancelado')`);
        await queryRunner.query(`CREATE TYPE "public"."adocoes_onde_ficara_dia_enum" AS ENUM('dentro_de_casa', 'quintal_area_externa', 'ambos', 'outro')`);
        await queryRunner.query(`CREATE TYPE "public"."adocoes_onde_ficara_noite_enum" AS ENUM('dentro_de_casa', 'quintal_area_externa', 'ambos', 'outro')`);
        await queryRunner.query(`CREATE TYPE "public"."adocoes_possui_apoio_cuidado_enum" AS ENUM('sim', 'nao', 'as_vezes')`);
        await queryRunner.query(`CREATE TABLE "adocoes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pet_id" uuid NOT NULL, "adotante_id" uuid NOT NULL, "status" "public"."adocoes_status_enum" NOT NULL DEFAULT 'pendente', "data_conclusao" TIMESTAMP, "onde_ficara_dia" "public"."adocoes_onde_ficara_dia_enum" NOT NULL, "onde_ficara_noite" "public"."adocoes_onde_ficara_noite_enum" NOT NULL, "possui_apoio_cuidado" "public"."adocoes_possui_apoio_cuidado_enum" NOT NULL, "observacoes_adotante" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "termos_aceitou_responsabilidade_longo_prazo" boolean NOT NULL DEFAULT false, "termos_aceitou_tempo_adaptacao" boolean NOT NULL DEFAULT false, "termos_aceitou_custos_veterinarios" boolean NOT NULL DEFAULT false, "termos_aceitos_em" TIMESTAMP NOT NULL, "termos_versao_termos" character varying NOT NULL, CONSTRAINT "PK_4c5f560b2fa2ff462c930b5fc16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favoritos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "adotante_id" uuid NOT NULL, "pet_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_76263661dc42dae494bb3c87752" UNIQUE ("adotante_id", "pet_id"), CONSTRAINT "PK_2a6a4d0119130451dc0b644590a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "adocoes_historico" ADD CONSTRAINT "FK_fb40f78da78a752bcc2fa15dcfd" FOREIGN KEY ("adocao_id") REFERENCES "adocoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adocoes_historico" ADD CONSTRAINT "FK_8dfdc463719f535218fbb11fb5f" FOREIGN KEY ("alterado_por_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adotantes" ADD CONSTRAINT "FK_6aff9283baa0112be06a0ab093f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doadores" ADD CONSTRAINT "FK_26d351a426efddb5c48390c1239" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fotos_pet" ADD CONSTRAINT "FK_1f20cb964c23f262969217fd801" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pets" ADD CONSTRAINT "FK_ba8b29d3913ac095c52c127aa89" FOREIGN KEY ("doador_id") REFERENCES "doadores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adocoes" ADD CONSTRAINT "FK_3a5b03369881f8db3a4787f8436" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adocoes" ADD CONSTRAINT "FK_249f7ec44ac7e8ca228035b668d" FOREIGN KEY ("adotante_id") REFERENCES "adotantes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favoritos" ADD CONSTRAINT "FK_e4def1a89fad72224336e8785b1" FOREIGN KEY ("adotante_id") REFERENCES "adotantes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favoritos" ADD CONSTRAINT "FK_604b74666daf142564ae38ec7f0" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favoritos" DROP CONSTRAINT "FK_604b74666daf142564ae38ec7f0"`);
        await queryRunner.query(`ALTER TABLE "favoritos" DROP CONSTRAINT "FK_e4def1a89fad72224336e8785b1"`);
        await queryRunner.query(`ALTER TABLE "adocoes" DROP CONSTRAINT "FK_249f7ec44ac7e8ca228035b668d"`);
        await queryRunner.query(`ALTER TABLE "adocoes" DROP CONSTRAINT "FK_3a5b03369881f8db3a4787f8436"`);
        await queryRunner.query(`ALTER TABLE "pets" DROP CONSTRAINT "FK_ba8b29d3913ac095c52c127aa89"`);
        await queryRunner.query(`ALTER TABLE "fotos_pet" DROP CONSTRAINT "FK_1f20cb964c23f262969217fd801"`);
        await queryRunner.query(`ALTER TABLE "doadores" DROP CONSTRAINT "FK_26d351a426efddb5c48390c1239"`);
        await queryRunner.query(`ALTER TABLE "adotantes" DROP CONSTRAINT "FK_6aff9283baa0112be06a0ab093f"`);
        await queryRunner.query(`ALTER TABLE "adocoes_historico" DROP CONSTRAINT "FK_8dfdc463719f535218fbb11fb5f"`);
        await queryRunner.query(`ALTER TABLE "adocoes_historico" DROP CONSTRAINT "FK_fb40f78da78a752bcc2fa15dcfd"`);
        await queryRunner.query(`DROP TABLE "favoritos"`);
        await queryRunner.query(`DROP TABLE "adocoes"`);
        await queryRunner.query(`DROP TYPE "public"."adocoes_possui_apoio_cuidado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."adocoes_onde_ficara_noite_enum"`);
        await queryRunner.query(`DROP TYPE "public"."adocoes_onde_ficara_dia_enum"`);
        await queryRunner.query(`DROP TYPE "public"."adocoes_status_enum"`);
        await queryRunner.query(`DROP TABLE "pets"`);
        await queryRunner.query(`DROP TYPE "public"."pets_compatibilidade_convive_com_gatos_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pets_compatibilidade_convive_com_outros_pets_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pets_compatibilidade_convive_com_criancas_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pets_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pets_nivel_energia_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pets_sexo_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pets_porte_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pets_especie_enum"`);
        await queryRunner.query(`DROP TABLE "fotos_pet"`);
        await queryRunner.query(`DROP TABLE "doadores"`);
        await queryRunner.query(`DROP TYPE "public"."doadores_endereco_uf_enum"`);
        await queryRunner.query(`DROP TYPE "public"."doadores_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "adotantes"`);
        await queryRunner.query(`DROP TYPE "public"."adotantes_moradia_tela_protecao_enum"`);
        await queryRunner.query(`DROP TYPE "public"."adotantes_moradia_posse_enum"`);
        await queryRunner.query(`DROP TYPE "public"."adotantes_moradia_tipo_enum"`);
        await queryRunner.query(`DROP TYPE "public"."adotantes_endereco_uf_enum"`);
        await queryRunner.query(`DROP TABLE "adocoes_historico"`);
        await queryRunner.query(`DROP TYPE "public"."adocoes_historico_status_novo_enum"`);
        await queryRunner.query(`DROP TYPE "public"."adocoes_historico_status_anterior_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
