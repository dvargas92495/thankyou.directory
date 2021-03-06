import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";

const Home: React.FunctionComponent = () => (
  <Layout>
    <div>
      <h1>Welcome to the Thank You Directory!</h1>
      <h3>
        A database of people who have supported others and a suite of tools to
        thank them properly!
      </h3>
      <button
        style={{
          padding: 8,
          borderRadius: 8,
          margin: "16px 0",
          backgroundColor: "#3ba4dc",
        }}
      >
        Get Started Today!
      </button>
    </div>
  </Layout>
);

export const Head = (): React.ReactElement => <LayoutHead />;
export default Home;
