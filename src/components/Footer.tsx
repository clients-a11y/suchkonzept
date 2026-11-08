import Link from "next/link";
import { DemoReset } from "@/components/DemoReset";
import { Wordmark } from "@/components/Wordmark";
import { SITE } from "@/data/site";

export function Footer() {
  const { contact } = SITE;
  return (
    <footer className="t-footer">
      <div className="t-container t-footer__grid">
        {SITE.footer.map((column) => (
          <div key={column.title} className="t-footer__col">
            <h2 className="t-footer__title">{column.title}</h2>
            <ul className="t-footer__links">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="t-footer__col">
          <h2 className="t-footer__title">Prototyp</h2>
          <ul className="t-footer__links">
            <li>
              <Link href="/testszenarien">Übersicht Testszenarien</Link>
            </li>
            <li>
              <Link href="/testszenarien/testfaelle">Testfälle</Link>
            </li>
            <li>
              <DemoReset />
            </li>
          </ul>
        </div>
        <div className="t-footer__col">
          <h2 className="t-footer__title">Bürgerservice</h2>
          <address className="t-footer__address">
            {contact.office}
            <br />
            {contact.address}
            <br />
            Telefon {contact.phone}
            <br />
            {contact.hours}
          </address>
        </div>
      </div>
      <div className="t-footer__bottom">
        <div className="t-container t-footer__bottom-inner">
          <Wordmark />
          <p className="t-footer__note">
            Prototyp mit Beispieldaten. Musterland, Beispielstadt und alle Stellen, Personen und Inhalte sind fiktiv. Die Fotos
            sind KI-generierte Beispielbilder.
          </p>
        </div>
      </div>
    </footer>
  );
}
