import {
  createConnection,
  getConnectionOptions,
  getConnectionManager,
  Connection,
  EntitySchema,
} from "typeorm";


export const connect = (entities: EntitySchema[]): Promise<void | Connection> =>
  getConnectionManager().has("default")
    ? Promise.resolve()
    : getConnectionOptions().then((opts) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        createConnection({
          ...opts,
          entities,
          type: "mysql",
          migrations: undefined,
        })
      );
