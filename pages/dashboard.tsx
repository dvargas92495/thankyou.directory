import React, { useCallback, useEffect, useState } from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import RedirectToLogin from "@dvargas92495/ui/dist/components/RedirectToLogin";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import type { Handler as GetHandler } from "../functions/sponsors_get";
import type { Handler as PostHandler } from "../functions/sponsors_post";
import { SignedIn } from "@clerk/clerk-react";
import Button from "@dvargas92495/ui/dist/components/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";

type InnerPromise<T extends Promise<unknown>> = T extends Promise<infer R>
  ? R
  : unknown;

const UploadDialog = ({
  uuid,
  onSuccess,
}: {
  uuid: string;
  onSuccess: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [file, setFile] = useState<File>();
  const openDialog = useCallback(() => setIsOpen(true), [setIsOpen]);
  const closeDialog = useCallback(() => setIsOpen(false), [setIsOpen]);
  const postSponsors = useAuthenticatedHandler<PostHandler>({
    path: "sponsors",
    method: "POST",
  });
  return (
    <>
      <Button color={"primary"} onClick={openDialog} variant={"contained"}>
        Upload Sponsors
      </Button>
      <Dialog open={isOpen} onClose={closeDialog}>
        <DialogTitle>Upload Sponsors</DialogTitle>
        <DialogContent>
          <Input
            type={"file"}
            value={value}
            onChange={(e) => {
              const t = e.target as HTMLInputElement;
              console.log(t.value);
              setFile(t.files[0]);
              setValue(t.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              const reader = new FileReader();
              return new Promise<string>((resolve) => {
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsText(file);
              })
                .then((s) => {
                  const { contributors } = JSON.parse(s) as {
                    contributors: Record<
                      string,
                      {
                        imgSrc: string;
                        url: string;
                      }
                    >;
                  };

                  return postSponsors({
                    uuid,
                    sponsors: Object.entries(contributors).map(
                      ([name, { url, imgSrc }]) => ({
                        name,
                        url,
                        image: imgSrc,
                      })
                    ),
                  });
                })
                .then(() => {
                  onSuccess();
                  closeDialog();
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

const DashboardContent = () => {
  const [sponsors, setSponsors] = useState<
    InnerPromise<ReturnType<GetHandler>>["sponsors"]
  >([]);
  const [uuid, setUuid] = useState("");
  const getSponsors = useAuthenticatedHandler<GetHandler>({
    method: "GET",
    path: "sponsors",
  });
  const refresh = useCallback(
    () =>
      getSponsors({ uuid })
        .then((r) => setSponsors(r.sponsors))
        .catch(() => setSponsors([])),
    [setSponsors, getSponsors]
  );
  useEffect(() => {
    const uuid = window.location.hash.replace(/^#\//, "");
    setUuid(uuid);
    refresh();
  }, [setUuid, refresh]);
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
      <UploadDialog uuid={uuid} onSuccess={refresh} />
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
