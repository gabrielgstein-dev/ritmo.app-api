import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1716981844000 implements MigrationInterface {
    name = 'CreateInitialTables1716981844000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar tabela de usuários
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);

        // Criar tabela de empresas
        await queryRunner.query(`
            CREATE TABLE "company" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "cnpj" character varying,
                "workHours" integer NOT NULL DEFAULT 8,
                "lunchBreak" integer NOT NULL DEFAULT 1,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")
            )
        `);

        // Criar tabela de registros de ponto
        await queryRunner.query(`
            CREATE TABLE "time_record" (
                "id" SERIAL NOT NULL,
                "date" date NOT NULL,
                "entryTime" character varying NOT NULL,
                "lunchTime" character varying NOT NULL,
                "returnTime" character varying NOT NULL,
                "exitTime" character varying NOT NULL,
                "returnToWorkTime" character varying,
                "finalExitTime" character varying,
                "userId" integer NOT NULL,
                "companyId" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_c12a9d8d9e5f2c9b9e4e1b7e8f7" PRIMARY KEY ("id")
            )
        `);

        // Criar tabela de relacionamento entre usuários e empresas
        await queryRunner.query(`
            CREATE TABLE "user_companies_company" (
                "userId" integer NOT NULL,
                "companyId" integer NOT NULL,
                CONSTRAINT "PK_9d5e32e91b0f3c88b2e9b5e7e9d" PRIMARY KEY ("userId", "companyId")
            )
        `);

        // Adicionar chaves estrangeiras
        await queryRunner.query(`
            ALTER TABLE "time_record" ADD CONSTRAINT "FK_user_time_record"
            FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "time_record" ADD CONSTRAINT "FK_company_time_record"
            FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "user_companies_company" ADD CONSTRAINT "FK_user_companies"
            FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "user_companies_company" ADD CONSTRAINT "FK_companies_user"
            FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover chaves estrangeiras
        await queryRunner.query(`ALTER TABLE "user_companies_company" DROP CONSTRAINT "FK_companies_user"`);
        await queryRunner.query(`ALTER TABLE "user_companies_company" DROP CONSTRAINT "FK_user_companies"`);
        await queryRunner.query(`ALTER TABLE "time_record" DROP CONSTRAINT "FK_company_time_record"`);
        await queryRunner.query(`ALTER TABLE "time_record" DROP CONSTRAINT "FK_user_time_record"`);

        // Remover tabelas
        await queryRunner.query(`DROP TABLE "user_companies_company"`);
        await queryRunner.query(`DROP TABLE "time_record"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
