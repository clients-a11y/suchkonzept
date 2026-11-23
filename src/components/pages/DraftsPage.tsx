"use client";

import Link from "next/link";
import { CombinedRow, mix } from "@/components/pages/ResultPage";
import { findPlace } from "@/data/places";
import { SERVICE_STYLES } from "@/data/test-cases";
import { resultArea } from "@/lib/result-area";
import { searchInformation } from "@/lib/smart-search";
import { setServiceStyle, useServiceStyle } from "@/lib/test-config";

// The drafts for how the one list shows services, each with the same hits. One of them can be switched on
// for the prototype.
const TERM = "Hund anmelden";
const PLACE = "seehausen";

export function DraftsPage() {
  const active = useServiceStyle();
  const place = findPlace(PLACE);
  const area = resultArea(TERM, place, true);
  const rows = mix(area.kind === "services" ? area.services : [], searchInformation(TERM), false).slice(0, 4);

  return (
    <main id="inhalt" tabIndex={-1} className="t-main">
      <div className="t-pagehead">
        <div className="t-container">
          <p>
            <Link href="/testszenarien">Zurück zu den Testcases</Link>
          </p>
          <h1 className="t-h1">Entwürfe: Leistungen in der gemeinsamen Liste</h1>
          <p className="t-lead">
            Drei Entwürfe, wie Leistungen zwischen den Informationen stärker auffallen. Alle zeigen dieselben Treffer zu „{TERM}“
            in {place?.name}.
          </p>
        </div>
      </div>

      <div className="t-container t-page">
        <ul className="t-drafts">
          {SERVICE_STYLES.map(({ style, title, text }) => (
            <li key={style} className="t-draft">
              <h2 className="t-h3">{title}</h2>
              <p>{text}</p>
              <div className="t-draft__foot">
                <button type="button" className="t-btn t-btn--small" onClick={() => setServiceStyle(style)}>
                  Im Prototyp verwenden
                  <span className="visually-hidden">: {title}</span>
                </button>
                {style === active && <p className="t-variant__active">Aktiv im Prototyp</p>}
              </div>
              <ol className={`t-hits t-hits--${style}`}>
                {rows.map((row, index) => (
                  <CombinedRow key={row.kind === "service" ? row.service.slug : row.hit.key} row={row} index={index} place={place} variant={style} />
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
