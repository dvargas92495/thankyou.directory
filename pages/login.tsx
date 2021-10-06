import React from "react";
import { SignIn } from "@clerk/clerk-react";
import Layout, { LayoutHead } from "../src/Layout";

const Login: React.FunctionComponent = () => (
  <Layout>
    <SignIn />
  </Layout>
);

export const Head = (): React.ReactElement => <LayoutHead title={"Log In"} />;
export default Login;
