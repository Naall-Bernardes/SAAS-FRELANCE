/**
 * Script para rodar a sincronização de lotes de leilão pela linha de comando.
 * Uso: npm run sync:leiloes -- --state=SP
 */
import { syncAllAuctionSources } from "../src/lib/auction-aggregator";

async function main() {
  const stateArg = process.argv.find((a) => a.startsWith("--state="));
  const state = stateArg ? stateArg.split("=")[1] : undefined;

  console.log(`Sincronizando lotes de leilão${state ? ` (state=${state})` : ""}...`);
  const results = await syncAllAuctionSources({ state });

  for (const r of results) {
    if (r.ok) {
      console.log(`✔ ${r.source}: ${r.fetched} buscados, ${r.upserted} salvos`);
    } else {
      console.warn(`✘ ${r.source}: ${r.error}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Sync de leilões falhou:", err);
    process.exit(1);
  });
