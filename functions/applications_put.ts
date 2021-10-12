import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { getRepository } from "typeorm";
import Application from "../db/application";

const logic = ({ name, uuid }: Pick<Application, "name" | "uuid">) =>
  getRepository(Application)
    .update({ uuid }, { name })
    .then((applications) => ({
      applications,
    }));

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
