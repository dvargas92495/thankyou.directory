import React, { useEffect, useState } from "react";
import Layout, { LayoutHead } from "../src/Layout";
import RedirectToLogin from "../src/RedirectToLogin";
import type { Handler } from "../functions/applications_get";
import { SignedIn, UserProfile } from "@clerk/clerk-react";

type Applications = ReturnType<Handler>["applications"];

const ApplicationsView = () => {
  const [apps, setApps] = useState<Applications>([]);
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
    <RedirectToLogin />
    <ApplicationsView />
  </Layout>
);

export const Head = (): React.ReactElement => (
  <LayoutHead
    title={"User"}
    styles={`div.cl-component.cl-user-profile .cl-main+.cl-powered-by-clerk {
  position: absolute;
}

div.cl-component.cl-user-profile {
  background-color: unset;
  height: fit-content !important;
  position: relative;
}

div.cl-component.cl-user-profile div.cl-content {
  margin-left: 24px;
  margin-right: 24px;
}`}
  />
);
export default UserPage;
