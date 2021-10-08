import React, { useEffect, useState } from "react";
import Layout, { LayoutHead } from "../src/Layout";
import type { Applications } from "../db/schema";
import { SignedIn, UserProfile } from "@clerk/clerk-react";

const ApplicationsView = () => {
  const [apps, setApps] = useState<Applications[]>([]);
  useEffect(() => {
    fetch(`${process.env.API_URL}/applications`)
      .then((r) => (r.ok ? r.json() : { applications: [] }))
      .then((r) => setApps(r.applications));
  }, []);
  return (
    <ul>
      {apps.map((a) => (
        <li key={a.uuid}>{a.name}</li>
      ))}
    </ul>
  );
};

const UserPage: React.FunctionComponent = () => (
  <Layout>
    <SignedIn>
      <UserProfile />
    </SignedIn>
    <ApplicationsView />
  </Layout>
);

export const Head = (): React.ReactElement => <LayoutHead title={"User"} />;
export default UserPage;
