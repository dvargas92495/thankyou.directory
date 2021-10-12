import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "sponsors" })
export class Sponsor {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  image: string;
}
