import React from "react";
import { useSuspense } from "../../helpers/suspense";

export default function Suspense({ wait, children }) {
  if (!wait) {
    return <AnimatedWait />;
  }
  return <span>{children}</span>;
}

function AnimatedWait() {
  const frame = useSuspense();
  return <span>{frame}</span>;
}
