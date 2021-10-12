import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "sponsors",
  columns: {
    uuid: {
      type: "uuid",
      generated: true,
      primary: true,
    },
    name: {
      type: "varchar",
    },
    url: {
      type: "varchar",
    },
    image: {
      type: "varchar",
    },
  },
});
