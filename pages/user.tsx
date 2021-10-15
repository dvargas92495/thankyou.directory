import React, { useEffect, useState } from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import RedirectToLogin from "@dvargas92495/ui/dist/components/RedirectToLogin";
import type { Handler as GetHandler } from "../functions/applications/get";
import type { Handler as PostHandler } from "../functions/applications/post";
import type { Handler as DeleteHandler } from "../functions/applications/delete";
import type { Handler as PutHandler } from "../functions/applications/put";
import { SignedIn, UserProfile } from "@clerk/clerk-react";
import StringField from "@dvargas92495/ui/dist/components/StringField";
import Button from "@dvargas92495/ui/dist/components/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import UserProfileTab from "@dvargas92495/ui/dist/components/UserProfileTab";

type InnerPromise<T extends Promise<unknown>> = T extends Promise<infer R>
  ? R
  : unknown;

type Application = Omit<
  InnerPromise<ReturnType<GetHandler>>["applications"][number],
  "user_id"
>;

const NewApplication = ({
  onSuccess,
}: {
  onSuccess: (item: Application) => void;
}) => {
  const postApplications = useAuthenticatedHandler<PostHandler>({
    path: "applications",
    method: "POST",
  });
  const [name, setName] = useState("");
  const onClick = () => {
    postApplications({ name }).then((r) => onSuccess({ name, uuid: r.uuid }));
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

const ApplicationsTab = () => {
  const [editing, setEditing] = useState<Application>();
  const [items, setItems] = useState<Application[]>([]);
  const getApplications = useAuthenticatedHandler<GetHandler>({
    path: "applications",
    method: "GET",
  });
  const putApplications = useAuthenticatedHandler<PutHandler>({
    path: "applications",
    method: "PUT",
  });
  const deleteApplications = useAuthenticatedHandler<DeleteHandler>({
    path: "applications",
    method: "DELETE",
  });
  useEffect(() => {
    getApplications().then((r) => setItems(r.applications));
  }, [getApplications, setItems]);
  return (
    <>
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
              <NewApplication
                onSuccess={(item) => setItems([...items, item])}
              />
            ),
            items: items.map(({ name, uuid }) => ({
              title: "Name",
              display: name,
              id: uuid,
            })),
            onItemClick: (e, i) => {
              if (e.shiftKey) {
                deleteApplications({ uuid: i.id }).then(
                  (r) =>
                    r.success &&
                    setItems(items.filter((item) => item.uuid !== i.id))
                );
              } else if (e.ctrlKey) {
                setEditing({ name: i.display, uuid: i.id });
              } else {
                window.location.assign(`/dashboard#/${i.id}`);
              }
            },
          },
        ]}
      />
      <Dialog open={!!editing} onClose={() => setEditing(undefined)}>
        <DialogTitle>Edit Application Name</DialogTitle>
        <DialogContent>
          <StringField
            value={editing?.name || ""}
            setValue={(v) => editing && setEditing({ ...editing, name: v })}
            required
            fullWidth
            name={"Name"}
            label={"Name"}
            variant={"filled"}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (!editing) return;
              putApplications(editing).then((r) => {
                if (r.success)
                  setItems(
                    items.map((item) =>
                      item.uuid === editing?.uuid ? editing : item
                    )
                  );
                setEditing(undefined);
              });
            }}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
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
