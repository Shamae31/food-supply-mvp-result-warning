import type { ResultInput } from "@/lib/types";

export function getMissingResultCompletionItems(input: ResultInput): string[] {
  const missing: string[] = [];
  if (!Number.isFinite(input.settledPrice) || input.settledPrice <= 0) {
    missing.push("決着単価");
  }
  if (input.reasonCodes.length === 0) {
    missing.push("決着理由");
  }
  if (input.staffMemo.trim() === "") {
    missing.push("所感");
  }
  if (input.handoverNote.trim() === "") {
    missing.push("次回への申し送り");
  }
  return missing;
}

export function isResultComplete(input: ResultInput): boolean {
  return getMissingResultCompletionItems(input).length === 0;
}
