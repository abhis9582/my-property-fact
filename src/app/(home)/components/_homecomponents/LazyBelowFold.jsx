"use client";

import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("./Chatbot"), {
  ssr: false,
  loading: () => null,
});

const ScrollToTop = dynamic(() => import("./ScrollToTop"), {
  ssr: false,
  loading: () => null,
});

export default function LazyBelowFold() {
  return (
    <>
      <ScrollToTop />
      <Chatbot />
    </>
  );
}
