import { v4 } from "uuid";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";

const logic = () => ({
  applications: [
    {
      uuid: v4(),
      name: "RoamJS",
    },
  ],
});

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
