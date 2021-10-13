import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { getRepository } from "typeorm";
import Application from "../db/application";

const logic = ({
  name,
  user: { id },
}: {
  name: string;
  user: { id: string };
}) =>
  connectTypeorm([Application])
    .then(() => getRepository(Application).insert({ name, user_id: id }))
    .then((result) => ({
      uuid: result.identifiers[0].uuid as string,
    }));

export const handler = clerkAuthenticateLambda(createAPIGatewayProxyHandler(logic));
export type Handler = typeof logic;
