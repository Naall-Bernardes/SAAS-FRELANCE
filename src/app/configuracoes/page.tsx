import { SettingsForm } from "@/components/settings/SettingsForm";

export default function ConfiguracoesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Preferências gerais da sua conta e do produto.</p>
      </header>

      <SettingsForm />
    </div>
  );
}
