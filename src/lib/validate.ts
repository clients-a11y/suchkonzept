// Format checks for form fields. Messages say what is wrong and how to fix it.

export type Check = "steuerid" | "iban";

function steuerId(value: string): string | undefined {
  const digits = value.replace(/\s/g, "");
  if (!/^\d+$/.test(digits)) return "Die Steuer-Identifikationsnummer besteht nur aus Ziffern.";
  if (digits.length !== 11) return `Die Steuer-Identifikationsnummer hat elf Ziffern. Sie haben ${digits.length} eingegeben.`;
  if (digits.startsWith("0")) return "Die Steuer-Identifikationsnummer beginnt nicht mit einer 0.";
  return undefined;
}

function iban(value: string): string | undefined {
  const compact = value.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{2}/.test(compact)) return "Die IBAN beginnt mit zwei Buchstaben für das Land, zum Beispiel DE.";
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(compact)) {
    return "Nach den zwei Buchstaben folgen zwei Prüfziffern, danach nur Buchstaben und Ziffern.";
  }
  if (compact.startsWith("DE") && compact.length !== 22) return `Eine deutsche IBAN hat 22 Zeichen. Sie haben ${compact.length} eingegeben.`;
  if (compact.length < 15 || compact.length > 34) return "Die IBAN ist zu kurz oder zu lang.";
  // Check digits: the number formed from the rearranged IBAN leaves a remainder of 1 when divided by 97.
  const digits = (compact.slice(4) + compact.slice(0, 4)).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rest = 0;
  for (const d of digits) rest = (rest * 10 + Number(d)) % 97;
  if (rest !== 1) return "Die Prüfziffern der IBAN passen nicht. Vergleichen Sie die Eingabe mit Ihren Kontounterlagen.";
  return undefined;
}

export function checkValue(check: Check, value: string): string | undefined {
  return check === "steuerid" ? steuerId(value) : iban(value);
}
