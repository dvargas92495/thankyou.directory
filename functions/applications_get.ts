import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 } from "uuid";

export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      applications: [
        {
          uuid: v4(),
          name: "RoamJS",
        },
      ],
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    },
  };
};