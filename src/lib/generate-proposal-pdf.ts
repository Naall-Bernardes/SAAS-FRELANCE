import { jsPDF } from "jspdf";
import { formatCurrency } from "./format";
import type { ProposalDraft } from "./proposal-generator";

const PAGE_WIDTH = 210; // A4 em mm
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const INK = "#111111";
const MUTED = "#5b5b5b";
const ACCENT = "#2a63b8";
const LINE = "#dcdcdc";

function formatDateExtended(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

/** Gera o PDF da proposta a partir dos dados do formulário e dispara o download no navegador. */
export function generateProposalPdf(draft: ProposalDraft) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  function ensureSpace(height: number) {
    if (y + height > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  }

  // Cabeçalho
  doc.setTextColor(ACCENT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PROPOSTA COMERCIAL", MARGIN, y);
  y += 9;

  doc.setTextColor(INK);
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(draft.projectTitle || "Proposta de projeto", CONTENT_WIDTH);
  doc.text(titleLines, MARGIN, y);
  y += titleLines.length * 7 + 4;

  doc.setDrawColor(LINE);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 8;

  // Bloco de metadados (cliente / plataforma / prazo / data)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(MUTED);

  const metaRows: [string, string][] = [
    ["Cliente", draft.clientName || "—"],
    ["Plataforma", draft.platform || "—"],
    ["Prazo estimado", draft.deadline || "a combinar"],
    ["Data", formatDateExtended(new Date())],
  ];
  const colWidth = CONTENT_WIDTH / 2;
  metaRows.forEach(([label, value], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = MARGIN + col * colWidth;
    const rowY = y + row * 10;
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, x, rowY);
    doc.setFont("helvetica", "normal");
    doc.text(value, x + 32, rowY);
  });
  y += Math.ceil(metaRows.length / 2) * 10 + 6;

  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 10;

  // Corpo da proposta
  doc.setTextColor(INK);
  doc.setFontSize(11);
  const bodyParagraphs = (draft.body || "").split("\n");
  for (const paragraph of bodyParagraphs) {
    if (paragraph.trim() === "") {
      y += 4;
      continue;
    }
    const isBullet = paragraph.trim().startsWith("•");
    doc.setFont("helvetica", isBullet ? "normal" : "normal");
    const lines = doc.splitTextToSize(paragraph, CONTENT_WIDTH);
    ensureSpace(lines.length * 5.5 + 2);
    doc.text(lines, MARGIN, y);
    y += lines.length * 5.5 + 2;
  }

  y += 6;
  ensureSpace(28);
  doc.setDrawColor(LINE);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 10;

  // Investimento em destaque
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(MUTED);
  doc.text("INVESTIMENTO", MARGIN, y);
  y += 8;
  doc.setFontSize(16);
  doc.setTextColor(ACCENT);
  doc.text(draft.value > 0 ? formatCurrency(draft.value, draft.currency) : "A combinar", MARGIN, y);
  y += 14;

  // Assinatura
  ensureSpace(16);
  doc.setDrawColor(LINE);
  doc.line(MARGIN, y, MARGIN + 70, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(INK);
  doc.text(draft.freelancerName || "Seu nome", MARGIN, y);
  if (draft.freelancerTitle) {
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(MUTED);
    doc.text(draft.freelancerTitle, MARGIN, y);
  }

  const safeProject = (draft.projectTitle || "proposta").replace(/[^\p{L}\p{N} ]/gu, "").slice(0, 60).trim();
  const safeClient = (draft.clientName || "").replace(/[^\p{L}\p{N} ]/gu, "").slice(0, 40).trim();
  const filename = `Proposta - ${safeProject}${safeClient ? ` - ${safeClient}` : ""}.pdf`;

  doc.save(filename);
}
