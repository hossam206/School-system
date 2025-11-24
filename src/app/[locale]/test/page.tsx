// export const prerender = true; // Required for PPR

import { Suspense } from "react";
import ServerHeavy from "./components/heavyComp";

export default async function Test() {
  return (
    <main style={{ padding: 30 }}>
      <h1>PPR Demo (Server Components)</h1>
      {/* This part streams later (PPR boundary) */}
      <Suspense fallback={<p>Loading slow section…</p>}>
        <ServerHeavy />
      </Suspense>
    </main>
  );
}
