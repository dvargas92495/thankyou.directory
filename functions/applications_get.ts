import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { getRepository } from "typeorm";
import { Application } from "../db/application";

const logic = () =>
  getRepository(Application)
    .find()
    .then((applications) => ({
      applications,
    }));

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
