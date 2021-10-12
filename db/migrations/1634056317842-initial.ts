import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1634056317842 implements MigrationInterface {
    name = 'initial1634056317842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`applications\` (\`uuid\` char(36) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sponsors\` (\`uuid\` char(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`image\` varchar(255) NOT NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`sponsors\``);
        await queryRunner.query(`DROP TABLE \`applications\``);
    }

}
