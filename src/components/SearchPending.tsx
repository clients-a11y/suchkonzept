import { IconSearch } from "@/components/Icons";

// Bridges the 1 to 3 seconds in which the search judges a request.
export function SearchPending() {
  return (
    <div className="t-pending" role="status">
      <span className="t-pending__mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="48" height="48">
          <circle className="t-pending__track" cx="24" cy="24" r="21" />
          <circle className="t-pending__arc" cx="24" cy="24" r="21" />
        </svg>
        <IconSearch size={20} />
      </span>
      <p className="t-pending__text">Wir suchen die passende Antwort …</p>
    </div>
  );
}
