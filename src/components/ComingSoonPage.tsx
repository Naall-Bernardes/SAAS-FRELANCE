import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

interface ComingSoonPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
}

/** Placeholder consistente pras telas ainda não implementadas nesta fase — navegável, nunca 404. */
export function ComingSoonPage({ icon, title, description, bullets }: ComingSoonPageProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>

      <EmptyState
        icon={icon}
        title="Em construção"
        description="Esta tela ainda não foi implementada nesta fase — entra no roadmap e chega com o mesmo cuidado visual do resto do produto. O que ela vai ter:"
        action={
          <ul className="space-y-1.5 text-left text-sm text-muted-foreground">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-subtle-foreground" />
                {bullet}
              </li>
            ))}
          </ul>
        }
      />
    </div>
  );
}
