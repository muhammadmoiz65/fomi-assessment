import WorkspaceShell from "@/components/workspace/WorkspaceShell";

export const metadata = {
  title: "Fomi Pro — Workspace",
  description:
    "A lineage-based AI image workspace: branch, compare and refine generations with a non-blocking render queue.",
};

/** Part B — the reimagined professional workspace. */
export default function WorkspacePage() {
  return <WorkspaceShell />;
}
