import { Suspense } from "react";
import TopNav from "@/components/layout/TopNav";
import StudioShell from "@/components/studio/StudioShell";

/**
 * Home = Part A: the responsive AI content generation workspace.
 */
export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopNav />
      <Suspense fallback={<div className="flex-1" />}>
        <StudioShell />
      </Suspense>
    </div>
  );
}
