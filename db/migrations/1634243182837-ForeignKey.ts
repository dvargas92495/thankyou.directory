import {MigrationInterface, QueryRunner} from "typeorm";

export class ForeignKey1634243182837 implements MigrationInterface {
    name = 'ForeignKey1634243182837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sponsors\` ADD \`applicationUuid\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`sponsors\` ADD CONSTRAINT \`FK_f697263a158603ea69f4f77261c\` FOREIGN KEY (\`applicationUuid\`) REFERENCES \`applications\`(\`uuid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sponsors\` DROP FOREIGN KEY \`FK_f697263a158603ea69f4f77261c\``);
        await queryRunner.query(`ALTER TABLE \`sponsors\` DROP COLUMN \`applicationUuid\``);
    }

}
