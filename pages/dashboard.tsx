import React, { useEffect, useState } from "react";
import Layout, { LayoutHead } from "../src/Layout";
import RedirectToLogin from "@dvargas92495/ui/dist/components/RedirectToLogin";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import type { Handler as GetHandler } from "../functions/sponsors_get";
import { SignedIn } from "@clerk/clerk-react";

type InnerPromise<T extends Promise<unknown>> = T extends Promise<infer R>
  ? R
  : unknown;

const DashboardContent = () => {
  const [sponsors, setSponsors] =
    useState<InnerPromise<ReturnType<GetHandler>>["sponsors"]>([]);
  const getSponsors = useAuthenticatedHandler<GetHandler>({
    method: "GET",
    path: "sponsors",
  });
  useEffect(() => {
    const uuid = window.location.hash.replace(/^#\//, "");
    getSponsors({ uuid })
      .then((r) => setSponsors(r.sponsors))
      .catch(() => setSponsors([]));
  }, []);
  return (
    <div>
      <h1>Sponsors for Application</h1>
      <ul>
        {sponsors.map((s) => (
          <li key={s.uuid}>
            {s.name} at {s.url || ""} displayed by {s.image || ""}
          </li>
        ))}
      </ul>
    </div>
  );
};

const DashboardPage = (): React.ReactElement => {
  return (
    <Layout>
      <SignedIn>
        <DashboardContent />
      </SignedIn>
      <RedirectToLogin />
    </Layout>
  );
};

export const Head = (): React.ReactElement => (
  <LayoutHead title={"Dashboard"} />
);

export default DashboardPage;
