import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { getRepository } from "typeorm";
import Application from "../db/application";
import { connect } from "./common";

const logic = ({ uuid }: { uuid: string }) =>
  connect([Application])
    .then(() => getRepository(Application).delete({ uuid }))
    .then((applications) => ({
      applications,
    }));

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
