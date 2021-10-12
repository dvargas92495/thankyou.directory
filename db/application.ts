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
      generated: true,
    },
    name: {
      type: "varchar",
    },
    user_id: {
      type: "varchar",
    },
  },
});
