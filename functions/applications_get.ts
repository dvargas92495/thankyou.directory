import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { getRepository } from "typeorm";
import Application from "../db/application";

const logic = ({ user: { id } }: { user: { id: string } }) =>
  connectTypeorm([Application])
    .then(() => getRepository(Application).find({ user_id: id }))
    .then((applications) => ({
      applications,
    }));

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
