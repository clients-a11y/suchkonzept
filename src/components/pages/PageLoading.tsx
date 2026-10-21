// Shown for a moment while a page with an address parameter streams in.
export function PageLoading() {
  return (
    <div className="t-pagehead">
      <div className="t-container">
        <p role="status" className="t-loading">
          Seite wird geladen …
        </p>
      </div>
    </div>
  );
}
