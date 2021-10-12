import {MigrationInterface, QueryRunner} from "typeorm";

export class ApplicationUserId1634060406049 implements MigrationInterface {
    name = 'ApplicationUserId1634060406049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`user_id\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`user_id\``);
    }

}
