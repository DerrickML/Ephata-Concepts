"use client";

import { ViewTransition } from "react";

export default function PageTransition({ children }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div className="page-transition-wrapper">
        {children}
      </div>
    </ViewTransition>
  );
}
