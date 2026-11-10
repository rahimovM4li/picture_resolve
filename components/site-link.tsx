import type { ComponentProps } from "react";

/** Resolve local pages directly against their exported directory indexes. */
export default function SiteLink({ href, ...props }: ComponentProps<"a">) {
  if (href?.startsWith("/") && !href.startsWith("//")) {
    const parts = href.match(/^([^?#]*)(.*)$/);
    if (parts && !parts[1].endsWith("/") && !parts[1].includes("."))
      href = parts[1] + "/" + parts[2];
  }
  return <a href={href} {...props} />;
}
