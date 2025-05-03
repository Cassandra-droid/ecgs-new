import { SessionUser } from "@/types";
import { Navbar } from "./navbar";
import { PublicHeader } from "./public-header";

interface HeaderProps {
  user: SessionUser;
}

export function Header({ user }: HeaderProps) {
  const isAuthenticated = !!user;

  if (isAuthenticated) {
    return <Navbar user={use/>;
  }

  return <PublicHeader />;
}
