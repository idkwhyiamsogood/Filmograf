import React from "react";
import { Link as TanStackLink } from "@tanstack/react-router";

interface Props extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children?: React.ReactNode;
}

// `to`/`search` are cast loosely: hrefs here are built as plain runtime
// strings (often with an embedded query string) rather than routes known
// to the generated route tree at compile time.
export const Link: React.FC<Props> = ({ href, children, ...props }) => {
  const [pathname, search] = href.split("?");

  return (
    <TanStackLink
      to={(pathname || "/") as any}
      search={search ? (Object.fromEntries(new URLSearchParams(search)) as any) : undefined}
      {...props}
    >
      {children}
    </TanStackLink>
  );
};

export default Link;
