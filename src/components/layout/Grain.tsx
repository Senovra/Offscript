/**
 * Static film-grain overlay.
 * The texture itself is defined by the .grain class in globals.css.
 * It is a single non-animated layer, so it adds no ongoing GPU cost.
 */
export default function Grain() {
  return <div className="grain" aria-hidden="true" />;
}