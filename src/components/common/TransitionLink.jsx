"use client";

import Link from "next/link";
import { startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

function shouldUseNativeNavigation(event, target, href) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey ||
    (target && target !== "_self")
  ) {
    return true;
  }

  const value = String(href || "");
  return (
    !value ||
    value.startsWith("#") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );
}

export default function TransitionLink({
  href,
  onClick,
  replace = false,
  scroll,
  target,
  children,
  ...props
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hrefValue = typeof href === "string" ? href : href?.pathname || "";

  function handleClick(event) {
    onClick?.(event);
    if (shouldUseNativeNavigation(event, target, hrefValue)) {
      return;
    }

    const nextUrl = new URL(hrefValue, window.location.href);
    if (nextUrl.origin !== window.location.origin || nextUrl.pathname === pathname) {
      return;
    }

    event.preventDefault();
    startTransition(() => {
      if (replace) {
        router.replace(hrefValue, { scroll });
      } else {
        router.push(hrefValue, { scroll });
      }
    });
  }

  return (
    <Link href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
