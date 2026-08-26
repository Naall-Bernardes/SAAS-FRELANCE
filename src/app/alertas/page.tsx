import { AlertsBoard } from "@/components/alerts/AlertsBoard";

export default function AlertasPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Alertas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Alertas personalizados que avisam quando surgir uma oportunidade que combina com você.
        </p>
      </header>

      <AlertsBoard />
    </div>
  );
}
