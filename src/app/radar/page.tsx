import { Search } from "lucide-react";
import { RadarCard } from "@/components/opportunities/RadarCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { DEMO_OPPORTUNITIES } from "@/lib/demo-opportunities";
import type { BadgeVariant } from "@/components/ui/Badge";

const CANDIDATE_NOW = DEMO_OPPORTUNITIES.filter((op) => op.matchScore >= 90).sort((a, b) => b.matchScore - a.matchScore);
const GOOD = DEMO_OPPORTUNITIES.filter((op) => op.matchScore >= 75 && op.matchScore < 90).sort(
  (a, b) => b.matchScore - a.matchScore
);
const EVALUATE = DEMO_OPPORTUNITIES.filter((op) => op.matchScore >= 60 && op.matchScore < 75).sort(
  (a, b) => b.matchScore - a.matchScore
);

export default function RadarPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Radar de oportunidades</h1>
        <p className="mt-1 text-sm text-muted-foreground">As oportunidades que merecem sua atenção agora.</p>
      </header>

      <RadarSection
        title="Candidate-se agora"
        emoji="🔥"
        description="Oportunidades excelentes publicadas recentemente."
        items={CANDIDATE_NOW}
        badgeLabel="CANDIDATE-SE AGORA"
        badgeVariant="hot"
      />

      <RadarSection
        title="Boas oportunidades"
        emoji="🟢"
        description="Boa compatibilidade e condições favoráveis."
        items={GOOD}
        badgeLabel="Boa oportunidade"
        badgeVariant="good"
      />

      <RadarSection
        title="Avaliar"
        emoji="🟡"
        description="Podem ser interessantes, mas apresentam riscos."
        items={EVALUATE}
        badgeLabel="Avaliar com atenção"
        badgeVariant="warning"
      />
    </div>
  );
}

function RadarSection({
  title,
  emoji,
  description,
  items,
  badgeLabel,
  badgeVariant,
}: {
  title: string;
  emoji: string;
  description: string;
  items: typeof DEMO_OPPORTUNITIES;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
}) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <span aria-hidden="true">{emoji}</span> {title}
          <span className="rounded-full bg-surface-hover px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {items.length}
          </span>
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nada por aqui ainda"
          description="Quando novas oportunidades entrarem nessa faixa de match, elas aparecem aqui automaticamente."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((op) => (
            <RadarCard key={op.id} op={op} badgeLabel={badgeLabel} badgeVariant={badgeVariant} />
          ))}
        </div>
      )}
    </section>
  );
}
