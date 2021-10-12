import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "applications" })
export class Application {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  name: string;
}
