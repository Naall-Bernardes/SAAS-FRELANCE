# SAAS-FRELANCE

SaaS que agrega oportunidades de freelance de várias plataformas — **Workana**,
**99Freelas**, **Freelancer.com** e **Upwork** — em um único painel, com
sincronização periódica e busca/filtro por palavra-chave, categoria e orçamento.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Prisma** + **PostgreSQL**
- **Tailwind CSS**
- Sistema de **conectores plugáveis** por fonte (`src/lib/connectors/`)

## Como funciona

Cada fonte tem um "conector" que implementa a mesma interface
(`fetchOpportunities`) e devolve vagas já normalizadas. O agregador
(`src/lib/aggregator.ts`) roda todos os conectores, faz upsert no banco
(dedup por fonte + id externo) e nunca deixa a falha de um conector derrubar
os demais.

| Fonte | Como busca | Status |
|---|---|---|
| Freelancer.com | API pública oficial | ✅ funciona sem credenciais (token opcional aumenta rate limit) |
| Upwork | API oficial (GraphQL, OAuth2) | ⚠️ precisa de app aprovado pela Upwork + credenciais — sem elas o conector é pulado automaticamente |
| Workana | Scraping do HTML público de busca | ⚠️ seletores CSS precisam ser validados/ajustados contra o site real antes de produção |
| 99Freelas | Scraping do HTML público de busca | ⚠️ mesmo aviso acima |

> **Nota sobre scraping:** os conectores de Workana e 99Freelas dependem da
> estrutura HTML atual dessas páginas, que pode mudar sem aviso. Antes de
> colocar em produção, confira os seletores em `src/lib/connectors/workana.ts`
> e `src/lib/connectors/freelas99.ts` contra o HTML real, respeite o
> `robots.txt` e os Termos de Uso de cada site, e evite polling agressivo.

## Setup

```bash
npm install
cp .env.example .env
# edite .env com DATABASE_URL e as credenciais que tiver

npx prisma migrate dev --name init
npm run dev
```

Abra http://localhost:3000.

## Sincronizar oportunidades

Localmente:

```bash
npm run sync
# ou com termo de busca:
npm run sync -- --query="desenvolvedor react"
```

Via API (útil para cron externo):

```bash
curl -X POST "http://localhost:3000/api/sync?query=react" \
  -H "Authorization: Bearer $CRON_SECRET"
```

Em produção na Vercel, `vercel.json` já define um cron que chama `/api/sync`
a cada 3 horas. Defina a env var `CRON_SECRET` no projeto Vercel para que o
endpoint fique protegido — a própria Vercel injeta o header `Authorization`
automaticamente nas chamadas de cron quando essa env var existe.

## Adicionar uma nova fonte

1. Crie `src/lib/connectors/minha-fonte.ts` implementando a interface
   `Connector` (veja `src/lib/connectors/types.ts`).
2. Registre a instância em `src/lib/connectors/index.ts`.

Pronto — ela passa a entrar automaticamente no sync e nos filtros da UI.

## Roadmap sugerido

- [ ] Autenticação de usuários (ex: NextAuth) + buscas salvas com alerta por e-mail
- [ ] Trocar scraping por headless browser (Playwright) se Workana/99Freelas
      passarem a renderizar a listagem via JS
- [ ] Paginação e ordenação avançada no dashboard
- [ ] Deduplicação semântica entre fontes (mesma vaga postada em vários sites)
