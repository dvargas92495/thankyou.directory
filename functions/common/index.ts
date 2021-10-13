import { sessions, users } from "@clerk/clerk-sdk-node";
import { APIGatewayProxyHandler } from "aws-lambda";
import {
  createConnection,
  getConnectionOptions,
  getConnectionManager,
  Connection,
  EntitySchema,
} from "typeorm";

export const authenticate =
  (fcn: APIGatewayProxyHandler): APIGatewayProxyHandler =>
  (event, context, callback) => {
    const sessionToken = (
      event.headers.Authorization ||
      event.headers.authorization ||
      ""
    ).replace(/^Bearer /, "");
    if (!sessionToken) {
      return Promise.resolve({
        statusCode: 401,
        body: "No session token found",
        headers: {
          "Access-Control-Allow-Origin": "https://thankyou.directory",
        },
      });
    }
    const sessionId = event.queryStringParameters?._clerk_session_id || "";
    if (!sessionId) {
      return Promise.resolve({
        statusCode: 401,
        body: "No session id found",
        headers: {
          "Access-Control-Allow-Origin": "https://thankyou.directory",
        },
      });
    }
    return sessions
      .verifySession(sessionId, sessionToken)
      .then((session) =>
        session.userId ? users.getUser(session.userId) : undefined
      )
      .then((user) => {
        if (user) {
          const response = fcn(
            {
              ...event,
              requestContext: { ...event.requestContext, authorizer: { user } },
            },
            context,
            callback
          );
          return (
            response ||
            Promise.resolve({
              statusCode: 204,
              body: "",
              headers: {
                "Access-Control-Allow-Origin": "https://thankyou.directory",
              },
            })
          );
        }
        return Promise.resolve({
          statusCode: 401,
          body: "No user found",
          headers: {
            "Access-Control-Allow-Origin": "https://thankyou.directory",
          },
        });
      })
      .catch((e) => ({
        statusCode: 500,
        body: e.message,
        headers: {
          "Access-Control-Allow-Origin": "https://thankyou.directory",
        },
      }));
  };

export const connect = (entities: EntitySchema[]): Promise<void | Connection> =>
  getConnectionManager().has("default")
    ? Promise.resolve()
    : getConnectionOptions().then((opts) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        createConnection({
          ...opts,
          entities,
          type: "mysql",
          migrations: undefined,
        })
      );
