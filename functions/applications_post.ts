import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { getRepository } from "typeorm";
import Application from "../db/application";

const logic = ({ name }: Pick<Application, "name">) =>
  getRepository(Application)
    .insert({ name })
    .then((applications) => ({
      applications,
    }));

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
