import React from "react";
import Layout, { LayoutHead } from "../src/Layout";

const Login: React.FunctionComponent = () => (
  <Layout>
    <div>Login</div>
  </Layout>
);

export const Head = (): React.ReactElement => <LayoutHead title={'Log In'} />
export default Login;
