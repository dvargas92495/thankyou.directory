import { EntitySchema } from "typeorm";
import Application from "./application";

export type SponsorSchema = {
  uuid: string;
  name: string;
  url: string;
  image: string;
  application: string;
};

export default new EntitySchema<SponsorSchema>({
  name: "sponsors",
  columns: {
    uuid: {
      type: "uuid",
      generated: "uuid",
      primary: true,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    url: {
      type: "varchar",
    },
    image: {
      type: "varchar",
    },
  },
  relations: {
    application: {
      target: Application.options.name,
      type: "many-to-one",
    },
  },
});
