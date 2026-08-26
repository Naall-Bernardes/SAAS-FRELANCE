/**
 * Script para rodar a sincronização de oportunidades pela linha de comando.
 * Uso: npm run sync -- --query="react"
 */
import { syncAllSources } from "../src/lib/aggregator";

async function main() {
  const queryArg = process.argv.find((a) => a.startsWith("--query="));
  const query = queryArg ? queryArg.split("=")[1] : "";

  console.log(`Sincronizando oportunidades${query ? ` (query="${query}")` : ""}...`);
  const results = await syncAllSources(query);

  for (const r of results) {
    if (r.ok) {
      console.log(`✔ ${r.source}: ${r.fetched} buscadas, ${r.upserted} salvas`);
    } else {
      console.warn(`✘ ${r.source}: ${r.error}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Sync falhou:", err);
    process.exit(1);
  });
