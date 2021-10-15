import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { getRepository } from "typeorm";
import Application from "../../db/application";

const logic = ({
  name,
  uuid,
  user: { id },
}: {
  name: string;
  uuid: string;
  user: { id: string };
}) =>
  connectTypeorm([Application])
    .then(() =>
      getRepository(Application).update({ uuid, user_id: id }, { name })
    )
    .then((result) => ({
      success: !!result.affected,
    }));

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
