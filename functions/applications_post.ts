import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { getRepository } from "typeorm";
import Application from "../db/application";
import { connect } from "./common";

const logic = ({ name }: { name: string }) =>
  connect([Application])
    .then(() => getRepository(Application).insert({ name }))
    .then((applications) => ({
      applications,
    }));

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
