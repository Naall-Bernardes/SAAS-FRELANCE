"use client";

import { Modal } from "@/components/ui/Modal";
import { ScenarioCalculator, type ScenarioCalculatorInitial } from "./ScenarioCalculator";

export function AuctionCalculatorModal({
  open,
  onClose,
  kind,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  kind: "imovel" | "veiculo";
  initial: ScenarioCalculatorInitial;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Calculadora de rentabilidade" size="lg">
      <ScenarioCalculator kind={kind} initial={initial} />
    </Modal>
  );
}
