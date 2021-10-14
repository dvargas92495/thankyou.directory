import { EntitySchema } from "typeorm";

type Application = {
  uuid: string;
  name: string;
  user_id: string;
};

export default new EntitySchema<Application>({
  name: "applications",
  columns: {
    uuid: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    user_id: {
      type: "varchar",
      nullable: false,
    },
  },
});
