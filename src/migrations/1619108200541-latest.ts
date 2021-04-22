import {MigrationInterface, QueryRunner} from "typeorm";

export class latest1619108200541 implements MigrationInterface {
    name = 'latest1619108200541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "imageUrn" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "imageUrn"`);
    }

}
