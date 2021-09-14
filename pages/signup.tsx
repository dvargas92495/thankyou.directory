import React from "react";
import Layout, { LayoutHead } from "../src/Layout";

const Signup: React.FunctionComponent = () => (
  <Layout>
    <div>Signup</div>
  </Layout>
);

export const Head = (): React.ReactElement => <LayoutHead title={"Sign up"} />;
export default Signup;
