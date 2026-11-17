import type { ComponentProps } from "react";

/** Keep local page links on their canonical trailing-slash URLs. */
export default function SiteLink({ href, ...props }: ComponentProps<"a">) {
  if (href?.startsWith("/") && !href.startsWith("//")) {
    const parts = href.match(/^([^?#]*)(.*)$/);
    if (parts && !parts[1].endsWith("/") && !parts[1].includes("."))
      href = parts[1] + "/" + parts[2];
  }
  return <a href={href} {...props} />;
}
