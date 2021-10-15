import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import Sponsor, { SponsorSchema } from "../db/sponsor";
import Application from "../db/application";
import { getRepository } from "typeorm";

class UnauthorizedError extends Error {
  constructor(args: string) {
    super(args);
  }
  readonly code = 401;
}

const logic = ({
  uuid,
  sponsors,
  user: { id },
}: {
  uuid: string;
  sponsors: Omit<SponsorSchema, "application" | "uuid">[];
  user: { id: string };
}) =>
  connectTypeorm([Application, Sponsor])
    .then(() => getRepository(Application).findOne(uuid))
    .then((application) => {
      if (application.user_id !== id) {
        throw new UnauthorizedError(
          "User does not have access to this applications sponsors"
        );
      } else {
        return getRepository(Sponsor)
          .insert(sponsors.map((s) => ({ ...s, application: uuid })))
          .then((result) => ({ count: result.identifiers.length }));
      }
    });

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
