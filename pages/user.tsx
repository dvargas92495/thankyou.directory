import React, { useEffect, useState } from "react";
import Layout, { LayoutHead } from "../src/Layout";
import RedirectToLogin from "../src/RedirectToLogin";
import type { Handler } from "../functions/applications_get";
import type { Handler as PostHandler } from "../functions/applications_post";
import { SignedIn, UserProfile, useSession } from "@clerk/clerk-react";
import ReactDOM from "react-dom";
import { Button, StringField } from "@dvargas92495/ui";

type InnerPromise<T extends Promise<unknown>> = T extends Promise<infer R>
  ? R
  : unknown;

type GetResponse = ReturnType<Handler>;
type Applications = InnerPromise<GetResponse>["applications"];
type Application = Omit<Applications[number], "user_id">;

type PostResponse = ReturnType<PostHandler>;

const NewApplication = ({
  onSuccess,
}: {
  onSuccess: (item: Application) => void;
}) => {
  const { getToken, id } = useSession();
  const [name, setName] = useState("");
  const onClick = () => {
    getToken()
      .then((token) =>
        fetch(`${process.env.API_URL}/applications?_clerk_session_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ name }),
        })
      )
      .then((r) => (r.ok ? r.json() : { uuid: "" }) as PostResponse)
      .then((r) => onSuccess({ name, uuid: r.uuid }));
  };
  return (
    <>
      <StringField
        value={name}
        setValue={setName}
        name={"Name"}
        label={"Name"}
      />
      <Button color={"primary"} disabled={!name} onClick={onClick}>
        Create
      </Button>
    </>
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
      {active && ReactDOM.createPortal(
        <>
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
                    <button
                      className="cl-list-item _1qJoyBQenGMr7kHEjL4Krl _2YW23wFdhOB4SEGzozPtqO qlMNWy3GFjlnVDhYmD_84"
                      key={i.title}
                    >
                      <div className={"_3cdHQF85GQrVzNyaksJFAn"}>{i.title}</div>
                      <div
                        className={
                          "_377YaX0RVdJAflWkqyk0_W _5doIP53SFIp-tF1LX17if"
                        }
                      >
                        <div>
                          <span className="cl-font-semibold ">{i.display}</span>
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
              {c.Component && (
                <div style={{ padding: "24px 32px" }}>
                  <c.Component />
                </div>
              )}
            </div>
          ))}
        </>,
        document.querySelector("div.cl-content") || document.body
      )}
    </>
  ) : (
    <div />
  );
};

const ApplicationsTab = () => {
  const { getToken, id } = useSession();
  const [items, setItems] = useState<Application[]>([]);
  useEffect(() => {
    getToken()
      .then((token) =>
        fetch(`${process.env.API_URL}/applications?_clerk_session_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      )
      .then((r) => (r.ok ? r.json() : { applications: [] }) as GetResponse)
      .then((r) => setItems(r.applications));
  }, [getToken, id, setItems]);
  return (
    <UserProfileTab
      id={"applications"}
      icon={
        <svg
          width="1.25em"
          height="1.25em"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
          className="cl-icon"
        >
          <g id="application">
            <g>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.5,9h9C12.78,9,13,8.78,13,8.5C13,8.22,12.78,8,12.5,8h-9C3.22,8,3,8.22,3,8.5
			C3,8.78,3.22,9,3.5,9z M3.5,11h5C8.78,11,9,10.78,9,10.5C9,10.22,8.78,10,8.5,10h-5C3.22,10,3,10.22,3,10.5
			C3,10.78,3.22,11,3.5,11z M19,1H1C0.45,1,0,1.45,0,2v16c0,0.55,0.45,1,1,1h18c0.55,0,1-0.45,1-1V2C20,1.45,19.55,1,19,1z M18,17H2
			V6h16V17z M3.5,13h7c0.28,0,0.5-0.22,0.5-0.5c0-0.28-0.22-0.5-0.5-0.5h-7C3.22,12,3,12.22,3,12.5C3,12.78,3.22,13,3.5,13z"
              />
            </g>
          </g>
        </svg>
      }
      cards={[
        {
          title: "Create",
          description: "Add a new application",
          Component: () => (
            <NewApplication onSuccess={(item) => setItems([...items, item])} />
          ),
          items: items.map(({ name }) => ({ title: "Name", display: name })),
        },
      ]}
    />
  );
};

const UserPage: React.FunctionComponent = () => (
  <Layout>
    <SignedIn>
      <UserProfile />
      <ApplicationsTab />
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
