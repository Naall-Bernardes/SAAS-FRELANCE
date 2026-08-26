import { ProfileForm } from "@/components/profile/ProfileForm";

export default function MeuPerfilPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Meu Perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A base que a IA usa pra calcular o Match com cada oportunidade.
        </p>
      </header>

      <ProfileForm />
    </div>
  );
}
