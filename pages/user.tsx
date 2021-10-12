import React, { useEffect, useState } from "react";
import Layout, { LayoutHead } from "../src/Layout";
import RedirectToLogin from "../src/RedirectToLogin";
import type { Handler } from "../functions/applications_get";
import { SignedIn, UserProfile } from "@clerk/clerk-react";
import ReactDOM from "react-dom";

type InnerPromise<T extends Promise<unknown>> = T extends Promise<infer R>
  ? R
  : unknown;

type Applications = InnerPromise<ReturnType<Handler>>["applications"];

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

const UserProfileTab = ({
  id,
  subtitle = `Manage ${id}`,
  cards = [],
  icon,
}: {
  id: string;
  subtitle?: string;
  icon?: React.ReactNode;
  cards?: {
    title: string;
    description: string;
    items?: { title: string; display: string }[];
    Component?: React.FC;
  }[];
}) => {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  useEffect(() => {
    setMounted(true);
    window.addEventListener("hashchange", (e) => {
      setActive(e.newURL.endsWith(`#/${id}`));
    });
    setActive(window.location.hash === `#/${id}`);
  }, [setMounted, id, setActive]);
  const title = `${id.slice(0, 1).toUpperCase()}${id.slice(1)}`;
  return mounted ? (
    <>
      {ReactDOM.createPortal(
        <a
          className={`cl-navbar-link${active ? " cl-active" : ""}`}
          href={`${window.location.origin}/user#/${id}`}
        >
          {icon}
          {title}
        </a>,
        document.querySelector("nav.cl-navbar") || document.body
      )}
      {ReactDOM.createPortal(
        <div className="cl-content">
          <div className="cl-page-heading">
            <div className="cl-text-container">
              <h2 className="cl-title">{title}</h2>
              <p className="cl-subtitle">{subtitle}</p>
            </div>
          </div>
          {cards.map((c) => (
            <div
              className={
                "wKjtxHPVelSpGxgKD4J-K _1OzNYgdyNED3jLWN6DXv1T cl-themed-card"
              }
              key={c.title}
            >
              <div>
                <h1>{c.title}</h1>
                <p>{c.description}</p>
              </div>
              {c.items && (
                <div className="cl-titled-card-list">
                  {c.items.map((i) => (
                    <button className="cl-list-item" key={i.title}>
                      <div>{i.title}</div>
                      <div>
                        <div>
                          <span className="cl-font-semibold">{i.display}</span>
                        </div>
                        <div>
                          <svg
                            width="1.25em"
                            height="1.25em"
                            viewBox="0 0 20 20"
                            stroke="#335BF1"
                            fill="none"
                          >
                            <path
                              d="M3.333 10h13.332M11.666 5l5 5-5 5"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {c.Component && <c.Component />}
            </div>
          ))}
        </div>,
        document.querySelector("div.cl-main") || document.body
      )}
    </>
  ) : (
    <div />
  );
};

const UserPage: React.FunctionComponent = () => (
  <Layout>
    <SignedIn>
      <UserProfile />
      <UserProfileTab
        id={"applications"}
        cards={[
          {
            title: "Apps",
            description: "Manage apps",
            Component: ApplicationsView,
          },
        ]}
      />
    </SignedIn>
    <RedirectToLogin />
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
