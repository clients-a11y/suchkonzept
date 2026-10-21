import { SITE } from "@/data/site";

// Quiet link to the diagram of the search switch, for demos with stakeholders.
export function DiagramLink() {
  return (
    <p className="t-diagramlink">
      <a href={SITE.searchDiagram} target="_blank" rel="noopener noreferrer">
        Ablauf und Punkteregeln als Diagramm
        <span className="visually-hidden"> (öffnet in neuem Tab)</span>
      </a>
    </p>
  );
}
