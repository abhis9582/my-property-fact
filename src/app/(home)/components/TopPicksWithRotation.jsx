"use client";

import MpfTopPicks from "./mpfTopPick";

export default function TopPicksWithRotation({ initialProject }) {
  return <MpfTopPicks topProject={initialProject ?? null} />;
}
