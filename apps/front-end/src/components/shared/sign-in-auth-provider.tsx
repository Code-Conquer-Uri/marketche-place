"use client";

import { SiApple, SiFacebook, SiGoogle } from "@icons-pack/react-simple-icons";
import type { FC } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

type SignInAuthProviderProps = {
  type: "Google" | "Facebook" | "Apple";
};

export const SignInAuthProvider: FC<SignInAuthProviderProps> = ({ type }) => {
  const handleSignInWithProvider = () => {
    switch (type) {
      case "Google":
        authClient.signIn.social({
          provider: "google",
        });
        break;

      case "Facebook":
        authClient.signIn.social({
          provider: "facebook",
        });
        break;

      case "Apple":
        authClient.signIn.social({
          provider: "apple",
        });
        break;
    }
  };

  const renderProvider = () => {
    switch (type) {
      case "Google":
        return <SiGoogle />;

      case "Facebook":
        return <SiFacebook />;

      case "Apple":
        return <SiApple />;
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      type="button"
      className="hover:cursor-pointer"
      onClick={handleSignInWithProvider}
    >
      {renderProvider()}
    </Button>
  );
};
