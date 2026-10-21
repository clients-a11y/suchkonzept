import Link from "next/link";
import { SITE } from "@/data/site";

// Quiet link to the page that explains the search switch, for demos with stakeholders.
export function DiagramLink() {
  return (
    <p className="t-diagramlink">
      <Link href={SITE.searchDiagram}>Ablauf und Punkteregeln als Diagramm</Link>
    </p>
  );
}
