"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { AuctionCalculatorModal } from "./AuctionCalculatorModal";

export function OpenCalculatorButton({ kind, label }: { kind: "imovel" | "veiculo"; label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        <Calculator className="h-4 w-4" strokeWidth={2} />
        {label}
      </button>
      <AuctionCalculatorModal
        open={open}
        onClose={() => setOpen(false)}
        kind={kind}
        initial={{ purchasePrice: 0, resaleBaseValue: 0 }}
      />
    </>
  );
}
