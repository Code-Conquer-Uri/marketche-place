import { permanentRedirect } from "next/navigation";

export default function AuthPage() {
  permanentRedirect("/auth/sign-in");
}
