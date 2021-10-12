import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "applications" })
export default class Application {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  name: string;

  @Column()
  user_id: string;
}
