import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { getRepository } from "typeorm";
import Application from "../../db/application";

const logic = ({
  uuid,
  user: { id },
}: {
  uuid: string;
  user: { id: string };
}) =>
  connectTypeorm([Application])
    .then(() => getRepository(Application).delete({ uuid, user_id: id }))
    .then((r) => ({
      success: !!r.affected,
    }));

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
