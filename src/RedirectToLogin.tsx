import { SignedOut } from "@clerk/clerk-react";
import { Loading } from "@dvargas92495/ui";
import React, { useEffect } from "react";

const Redirect = () => {
  useEffect(() => {
    window.history.pushState({ url: "/login" }, "");
  });
  return (
    <div>
      <Loading loading />
      <span style={{ marginLeft: 32 }}>Redirecting to login...</span>
    </div>
  );
};

const RedirectToLogin: React.FunctionComponent = () => {
  return (
    <SignedOut>
      <Redirect />
    </SignedOut>
  );
};

export default RedirectToLogin;
