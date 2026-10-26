import Link from "next/link";
import TopNav from "@/components/layout/TopNav";
import Icon from "@/components/ui/Icon";

export const metadata = {
  title: "Product Thinking — Fomi Pro",
  description: "The product rationale behind the lineage-based workspace.",
};

/* Part B, deliverable 2 — the written product-thinking document. */

function QA({ n, q, children }) {
  return (
    <section className="border-t border-[var(--border)] py-8">
      <div className="mb-3 flex items-baseline gap-3">
        <span className="font-mono text-sm font-semibold text-accent">{n}</span>
        <h2 className="text-lg font-semibold text-text sm:text-xl">{q}</h2>
      </div>
      <div className="space-y-3 text-[15px] leading-relaxed text-text-muted [&_strong]:font-semibold [&_strong]:text-text">
        {children}
      </div>
    </section>
  );
}

export default function ProductThinkingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopNav />
      <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-10 sm:px-6">
        {/* hero */}
        <div className="animate-fade-up">
          <Link
            href="/workspace"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-accent"
          >
            <Icon name="chevronRight" className="size-4 rotate-180" />
            Back to the workspace
          </Link>
          <p className="mb-2 text-sm font-medium text-accent">
            Part B · Product Thinking
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Fomi Pro — a workspace built around iteration
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text-muted">
            I chose the <strong className="text-text">Image Generation Workspace</strong>.
            The central bet: professional AI work is not one perfect prompt — it is{" "}
            <em>dozens of small refinements</em>. So the workspace is organised
            around <strong className="text-text">lineage</strong>: every image
            remembers the one it came from, and iteration becomes a navigable
            tree instead of an endless scroll.
          </p>
        </div>

        <div className="mt-6">
          <QA n="01" q="What problem were you trying to solve? Who for?">
            <p>
              I designed for the <strong>returning professional creator</strong> —
              someone who lives in the tool for hours a day and is rarely starting
              from zero. Today&apos;s generators optimise for the first image. But
              a pro&apos;s real work is the <strong>50 images after it</strong>:
              nudging light, cropping, trying a variation, then quietly needing the
              version from twenty minutes ago.
            </p>
            <p>
              In a flat gallery that history collapses into noise. You lose the
              thread of <em>how</em> you arrived somewhere, and good directions get
              buried. The problem I solved is{" "}
              <strong>keeping the structure of iteration visible and reversible</strong>.
            </p>
          </QA>

          <QA n="02" q="Your three most important UX decisions — and why">
            <p>
              <strong>1. Lineage as the organising model.</strong> Results aren&apos;t
              a grid; they&apos;re a branching tree. Any node can be selected, forked
              or refined, and the breadcrumb always shows the path back to the root.
              This makes exploration safe — you can chase a wild idea knowing the
              good version is one click away.
            </p>
            <p>
              <strong>2. A non-blocking render queue.</strong> Generation never
              freezes the canvas. Jobs drop into a queue, placeholders appear in the
              filmstrip, and you keep working while they render. For someone doing
              this all day, uninterrupted flow is the whole game.
            </p>
            <p>
              <strong>3. The canvas is the hero.</strong> One large focused image,
              a compare-with-parent toggle, and controls pushed to the edges
              (slim tool rail, bottom command bar, right inspector). On small
              screens the inspector becomes a slide-over so the image never shrinks.
            </p>
          </QA>

          <QA n="03" q="Which features did you intentionally leave out? Why?">
            <p>
              <strong>No node-graph / spaghetti editor.</strong> Powerful, but it
              turns a creative tool into an engineering one. Lineage gives 80% of the
              value with none of the intimidation.
            </p>
            <p>
              <strong>No wall of sliders.</strong> Advanced parameters exist but stay
              collapsed. Most pros reach for prompt, model, aspect and a reference —
              not CFG minutiae — so those come first.
            </p>
            <p>
              <strong>No social / explore feed in the workspace.</strong> The brief
              is the place work happens, not a marketing surface. Discovery belongs
              elsewhere so it doesn&apos;t compete for attention with the canvas.
            </p>
          </QA>

          <QA n="04" q="Which products inspired you? What would you improve?">
            <p>
              <strong>Figma</strong> — for making a dense, capable tool feel calm,
              and for treating history as a first-class citizen.{" "}
              <strong>Cursor</strong> — for a command bar that keeps you in flow.{" "}
              <strong>Krea / Higgsfield</strong> — for immersive, fast generation.
            </p>
            <p>
              What I&apos;d improve on the generators: they optimise the{" "}
              <em>first</em> result and then abandon you to a flat, lossy gallery.
              The relationship between images — what came from what — is thrown away.
              Fomi Pro keeps exactly that relationship and makes it the spine of the
              product.
            </p>
          </QA>

          <QA n="05" q="With another month, what would you improve?">
            <p>
              Real <strong>reference-image conditioning</strong> (drag an image in to
              steer style/character), a <strong>region mask</strong> for inpainting
              on the stage, and <strong>side-by-side diffing</strong> of any two
              nodes, not just parent/child. I&apos;d also add{" "}
              <strong>collections</strong> to promote favourites out of the tree, and
              persistence so a project survives a refresh (here it&apos;s mocked).
            </p>
          </QA>

          <QA n="06" q="The single workflow that differentiates this workspace">
            <p>
              <strong>Branching iteration with instant compare.</strong> Select any
              past image, refine or spin variations from it, and the new work attaches
              to its parent automatically — while a compare toggle shows exactly what
              changed. No other generator treats the <em>history of how you got here</em>{" "}
              as a navigable, forkable structure. That is the heart of Fomi Pro.
            </p>
          </QA>

          {/* trade-offs */}
          <section className="mt-8 rounded-2xl border border-[var(--border)] bg-surface-soft p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text">
              <Icon name="sliders" className="size-5 text-accent" />
              Design trade-offs
            </h2>
            <ul className="space-y-3 text-sm leading-relaxed text-text-muted">
              <li>
                <strong className="text-text">Prioritised:</strong> iteration speed,
                flow, and never losing a good version.
              </li>
              <li>
                <strong className="text-text">Simplified:</strong> advanced
                parameters tucked into progressive disclosure; a fixed batch size to
                keep the queue legible.
              </li>
              <li>
                <strong className="text-text">Removed:</strong> node graphs, in-app
                social feeds, and dense parameter panels.
              </li>
              <li>
                <strong className="text-text">Why:</strong> a tool used for hours a
                day wins on rhythm, not feature count. Every pixel defends the canvas.
              </li>
            </ul>
          </section>

          <p className="mt-8 text-sm text-text-subtle">
            Explore the implementation in the{" "}
            <Link href="/workspace" className="font-medium text-accent hover:underline">
              Pro Workspace
            </Link>{" "}
            or the mockup build on the{" "}
            <Link href="/" className="font-medium text-accent hover:underline">
              home studio
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
