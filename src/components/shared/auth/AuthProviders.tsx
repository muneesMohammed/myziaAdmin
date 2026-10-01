"use client";

type Props = {
  authType?: "Login" | "Signup";
};

export default function AuthProviders({ authType = "Login" }: Props) {
  void authType;
  return null;
}
